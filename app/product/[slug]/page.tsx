'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  RotateCcw,
  Shield,
  Star,
  Minus,
  Plus,
  ChevronRight,
  Check,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Product, Review, ProductVariant } from '@/lib/types';

interface ProductPageProps {
  params: { slug: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: productData } = await supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)')
        .eq('slug', slug)
        .single();

      if (productData) {
        setProduct(productData);

        // Fetch variants
        const { data: variantsData } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productData.id)
          .eq('is_active', true);

        if (variantsData) setVariants(variantsData);

        // Fetch reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*, user:profiles!reviews_user_id_fkey(full_name, avatar_url)')
          .eq('product_id', productData.id)
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (reviewsData) setReviews(reviewsData);

        // Fetch related products
        if (productData.category_id) {
          const { data: relatedData } = await supabase
            .from('products')
            .select('*, category:categories(*), brand:brands(*)')
            .eq('category_id', productData.category_id)
            .neq('id', productData.id)
            .eq('is_active', true)
            .limit(4);

          if (relatedData) setRelatedProducts(relatedData);
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) return;
    const result = await addToCart(product!.id, quantity, selectedVariant?.id);
    if (result.success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleWishlist = async () => {
    if (!user || !product) return;
    await toggleWishlist(product.id);
  };

  const currentPrice = selectedVariant?.price || product?.price || 0;
  const stockQuantity = selectedVariant?.quantity || product?.quantity || 0;
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square skeleton rounded-2xl" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 skeleton rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 skeleton rounded w-1/4" />
            <div className="h-10 skeleton rounded w-3/4" />
            <div className="h-6 skeleton rounded w-1/2" />
            <div className="h-24 skeleton rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length
      ? (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-foreground">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="hover:text-foreground"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {product.images[selectedImage] && (
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.is_new && (
                  <span className="bg-orange text-white text-sm font-medium px-3 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0',
                      selectedImage === index
                        ? 'ring-2 ring-orange'
                        : 'ring-1 ring-border'
                    )}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Brand & Category */}
            <div className="flex items-center gap-4 text-sm">
              {product.brand && (
                <Link
                  href={`/shop?brand=${product.brand.slug}`}
                  className="text-orange hover:underline"
                >
                  {product.brand.name}
                </Link>
              )}
              {product.category && (
                <>
                  <span className="text-muted-foreground">|</span>
                  <Link
                    href={`/shop?category=${product.category.slug}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < Math.round(product.rating_average)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating_average.toFixed(1)} ({product.rating_count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${currentPrice.toFixed(2)}</span>
              {product.compare_at_price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-sm text-green-500 font-medium">
                  Save ${(product.compare_at_price! - currentPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-muted-foreground">{product.short_description}</p>
            )}

            <Separator />

            {/* Variants */}
            {variants.length > 0 && (
              <div>
                <p className="font-medium mb-3">Select Variant</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.quantity <= 0}
                      className="relative"
                    >
                      {variant.name}
                      {selectedVariant?.id === variant.id && (
                        <Check className="w-3 h-3 ml-2" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.min(stockQuantity, q + 1))}
                    disabled={quantity >= stockQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {stockQuantity > 0 && stockQuantity < 10 && (
                  <span className="text-sm text-orange">
                    Only {stockQuantity} left
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-orange hover:bg-orange-600"
                disabled={stockQuantity <= 0}
                onClick={handleAddToCart}
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart
                  </>
                ) : stockQuantity <= 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={handleWishlist}>
                <Heart
                  className={cn('w-5 h-5', inWishlist && 'fill-current text-red-500')}
                />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Truck className="w-6 h-6 mx-auto mb-2 text-orange" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders $99+</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-orange" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day policy</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Shield className="w-6 h-6 mx-auto mb-2 text-orange" />
                <p className="text-sm font-medium">Secure</p>
                <p className="text-xs text-muted-foreground">SSL protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange"
              >
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'No description available.'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="pt-6">
              {Object.keys(product.specifications).length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{value as string}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specifications available.</p>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Rating Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-muted/50 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <p className="text-5xl font-bold">
                        {product.rating_average.toFixed(1)}
                      </p>
                      <div className="flex justify-center mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'w-5 h-5',
                              i < Math.round(product.rating_average)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted'
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on {reviews.length} reviews
                      </p>
                    </div>
                    <div className="space-y-2">
                      {ratingDistribution.map((item) => (
                        <div key={item.rating} className="flex items-center gap-2 text-sm">
                          <span className="w-6">{item.rating}</span>
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full transition-all"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground w-8">
                            {item.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-border pb-6 last:border-0"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {review.user?.avatar_url && (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={review.user.avatar_url}
                                alt={review.user.full_name || 'User'}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {review.user?.full_name || 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      'w-3 h-3',
                                      i < review.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-muted'
                                    )}
                                  />
                                ))}
                              </div>
                              {review.is_verified_purchase && (
                                <span className="text-green-500">Verified Purchase</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {review.title && (
                          <h4 className="font-medium mb-2">{review.title}</h4>
                        )}
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
