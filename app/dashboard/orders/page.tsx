'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Order } from '@/lib/types';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 skeleton rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/dashboard">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">Orders</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-6">Order History</h1>

          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.items?.length || 0} items
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                : 'bg-orange/10 text-orange'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-medium mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t placed any orders yet. Start shopping!
              </p>
              <Link href="/shop">
                <Button className="bg-orange hover:bg-orange-600">
                  Browse Products
                </Button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{selectedOrder.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedOrder.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange/10 text-orange'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      {item.product_image && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${selectedOrder.shipping_cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${selectedOrder.tax_amount.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-${selectedOrder.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="font-medium mb-2">Shipping Address</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shipping_address.full_name as string}
                      <br />
                      {selectedOrder.shipping_address.address_line1 as string}
                      <br />
                      {selectedOrder.shipping_address.city as string},{' '}
                      {selectedOrder.shipping_address.state as string}{' '}
                      {selectedOrder.shipping_address.postal_code as string}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
