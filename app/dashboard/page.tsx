'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  Heart,
  Settings,
  MapPin,
  CreditCard,
  LogOut,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useWishlist } from '@/hooks/use-wishlist';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Order } from '@/lib/types';
import { useRouter, usePathname } from 'next/navigation';

const sidebarItems = [
  { href: '/dashboard', icon: Package, label: 'Dashboard' },
  { href: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/dashboard/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/dashboard/addresses', icon: MapPin, label: 'Addresses' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardPage() {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" />
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 mb-4">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-orange text-white text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="font-semibold">
                      {profile?.full_name || 'User'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {profile?.email}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card>
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {sidebarItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          pathname === item.href
                            ? 'bg-orange/10 text-orange'
                            : 'hover:bg-muted'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        {item.label === 'Wishlist' && wishlistCount > 0 && (
                          <span className="ml-auto bg-orange text-white text-xs px-2 py-0.5 rounded-full">
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                    ))}
                    <button
                      onClick={signOut}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Welcome */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-muted-foreground">
                  Here&apos;s what&apos;s happening with your account.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Orders', value: orders.length, icon: Package },
                  { label: 'Wishlist Items', value: wishlistCount, icon: Heart },
                  { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length, icon: CreditCard },
                  { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, icon: Package },
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                          <stat.icon className="w-6 h-6 text-orange" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Orders */}
              <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/dashboard/orders">
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${order.total.toFixed(2)}
                            </p>
                            <p
                              className={`text-sm ${
                                order.status === 'delivered'
                                  ? 'text-green-500'
                                  : order.status === 'shipped'
                                  ? 'text-blue-500'
                                  : 'text-orange'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/shop">
                  <Card className="hover:border-orange transition-colors cursor-pointer">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-orange" />
                      </div>
                      <div>
                        <p className="font-medium">Continue Shopping</p>
                        <p className="text-sm text-muted-foreground">
                          Browse our latest products
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/dashboard/settings">
                  <Card className="hover:border-orange transition-colors cursor-pointer">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center">
                        <Settings className="w-6 h-6 text-orange" />
                      </div>
                      <div>
                        <p className="font-medium">Account Settings</p>
                        <p className="text-sm text-muted-foreground">
                          Update your personal information
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
