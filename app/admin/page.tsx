'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    recentOrders: Array<{ total: number; created_at: string }>;
  }>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
  });

  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        if (profile?.role !== 'admin') {
          router.push('/');
        } else {
          fetchStats();
        }
      };
      checkAdmin();
    }
  }, [user, profile, router]);

  const fetchStats = async () => {
    try {
      const [ordersData, productsData, usersData] = await Promise.all([
        supabase
          .from('orders')
          .select('total, created_at')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
      ]);

      const totalOrders = ordersData.data?.length || 0;
      const totalRevenue =
        ordersData.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
      const totalProducts = productsData.count || 0;
      const totalCustomers = usersData.count || 0;

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers,
        recentOrders: ordersData.data || [],
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-blue-500',
    },
    {
      title: 'Products',
      value: stats.totalProducts.toString(),
      change: '+3',
      trend: 'up',
      icon: Package,
      color: 'text-orange',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toString(),
      change: '+15',
      trend: 'up',
      icon: Users,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.full_name}
            </p>
          </div>
          <Button className="bg-orange hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm ${
                            stat.trend === 'up'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center bg-muted`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/products">
            <Card className="hover:border-orange transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <p className="font-medium">Manage Products</p>
                  <p className="text-sm text-muted-foreground">
                    Add, edit, or remove products
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/orders">
            <Card className="hover:border-orange transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <p className="font-medium">Manage Orders</p>
                  <p className="text-sm text-muted-foreground">
                    Process and track orders
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/customers">
            <Card className="hover:border-orange transition-colors cursor-pointer">
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <p className="font-medium">Manage Customers</p>
                  <p className="text-sm text-muted-foreground">
                    View customer data
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {(stats.recentOrders as Array<{ total: number; created_at: string }>).slice(0, 5).map((order, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">Order #{(i + 1).toString().padStart(4, '0')}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No orders yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
