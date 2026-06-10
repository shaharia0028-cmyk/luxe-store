'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (user && profile?.role !== 'admin') {
      router.push('/');
    } else if (user) {
      fetchProducts();
    }
  }, [user, profile, router, page, search]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*, category:categories(name), brand:brands(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, count } = await query;
    if (data) setProducts(data);
    if (count) setTotalCount(count);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const handleToggleActive = async (product: Product) => {
    await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id);
    fetchProducts();
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
            <h1 className="text-2xl font-bold">Products Management</h1>
            <p className="text-muted-foreground">{totalCount} products total</p>
          </div>
          <Button className="bg-orange hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Product</th>
                    <th className="text-left p-4 font-medium">Category</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Stock</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-4"><div className="h-4 skeleton rounded w-32" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-20" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-16" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-12" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-16" /></td>
                        <td className="p-4"><div className="h-4 skeleton rounded w-24" /></td>
                      </tr>
                    ))
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id} className="border-t hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                              {product.images[0] && (
                                <Image
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {product.category?.name || '-'}
                        </td>
                        <td className="p-4">${product.price.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={
                              product.quantity > 10
                                ? 'text-green-500'
                                : product.quantity > 0
                                ? 'text-orange'
                                : 'text-red-500'
                            }
                          >
                            {product.quantity}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleActive(product)}
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.is_active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {product.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/product/${product.slug}`}>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No products found
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
      </div>
    </div>
  );
}
