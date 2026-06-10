'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import type { Order } from '@/lib/types';

export default function AdminOrdersPage() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    if (user && profile?.role !== 'admin') {
      router.push('/');
    } else if (user) {
      fetchOrders();
    }
  }, [user, profile, router, page, search, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase
      .from('orders')
      .select('*, items:order_items(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (search) {
      query = query.ilike('order_number', `%${search}%`);
    }

    const { data, count } = await query;
    if (data) setOrders(data as Order[]);
    if (count) setTotalCount(count);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    fetchOrders();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status } as Order);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">{totalCount} orders total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search order number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Order</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Items</th>
                    <th className="text-left p-4 font-medium">Total</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Payment</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-4"><div className="h-4 skeleton rounded w-24" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-20" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-8" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-16" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-20" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-16" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-8" /></td>
                      </tr>
                    ))
                  ) : orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="border-t hover:bg-muted/30">
                        <td className="p-4">
                          <p className="font-medium">{order.order_number}</p>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4">{order.items?.length || 0}</td>
                        <td className="p-4 font-medium">${order.total.toFixed(2)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {page * ITEMS_PER_PAGE + 1} -{' '}
                  {Math.min((page + 1) * ITEMS_PER_PAGE, totalCount)} of {totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm">
                    Page {page + 1} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(v) => updateOrderStatus(selectedOrder.id, v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="font-medium capitalize">{selectedOrder.payment_status}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Items</p>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Shipping Address</p>
                    <p className="text-sm">
                      {selectedOrder.shipping_address?.full_name as string}<br />
                      {selectedOrder.shipping_address?.address_line1 as string}<br />
                      {selectedOrder.shipping_address?.city as string}, {' '}
                      {selectedOrder.shipping_address?.state as string} {' '}
                      {selectedOrder.shipping_address?.postal_code as string}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Order Summary</p>
                    <p className="text-sm">
                      Subtotal: ${(selectedOrder.subtotal || 0).toFixed(2)}<br />
                      Shipping: ${(selectedOrder.shipping_cost || 0).toFixed(2)}<br />
                      Tax: ${(selectedOrder.tax_amount || 0).toFixed(2)}<br />
                      <strong>Total: ${selectedOrder.total.toFixed(2)}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
