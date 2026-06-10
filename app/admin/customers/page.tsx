'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Mail, Calendar, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export default function AdminCustomersPage() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    if (user && profile?.role !== 'admin') {
      router.push('/');
    } else if (user) {
      fetchCustomers();
    }
  }, [user, profile, router, page, search]);

  const fetchCustomers = async () => {
    setLoading(true);
    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data, count } = await query;
    if (data) {
      // Fetch order data for each customer
      const customersWithOrders = await Promise.all(
        data.map(async (customer) => {
          const { data: orders } = await supabase
            .from('orders')
            .select('total')
            .eq('user_id', customer.id);
          return {
            ...customer,
            order_count: orders?.length || 0,
            total_spent: orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
          };
        })
      );
      setCustomers(customersWithOrders);
    }
    if (count) setTotalCount(count);
    setLoading(false);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
            <h1 className="text-2xl font-bold">Customers</h1>
            <p className="text-muted-foreground">{totalCount} customers total</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Customers Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
        ) : customers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={customer.avatar_url || ''} />
                      <AvatarFallback className="bg-orange text-white">
                        {customer.full_name?.[0]?.toUpperCase() || customer.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {customer.full_name || 'No name'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {customer.email}
                      </p>
                    </div>
                    {customer.role === 'admin' && (
                      <span className="text-xs bg-orange/10 text-orange px-2 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ShoppingBag className="w-4 h-4" />
                        <span>{customer.order_count} orders</span>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${customer.total_spent?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {new Date(customer.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No customers found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
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
      </div>
    </div>
  );
}
