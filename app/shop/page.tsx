'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutList,
  Star,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Product, Category, Brand } from '@/lib/types';
import { cn } from '@/lib/utils';

function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const ITEMS_PER_PAGE = 12;

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    if (category) setSelectedCategories([category]);
    if (brand) setSelectedBrands([brand]);
    if (search) setSearchQuery(search);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  // Fetch categories and brands
  useEffect(() => {
    const fetchFilters = async () => {
      const [categoriesData, brandsData] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('brands').select('*').order('name'),
      ]);

      if (categoriesData.data) setCategories(categoriesData.data);
      if (brandsData.data) setBrands(brandsData.data);

      // Get max price
      const { data: priceData } = await supabase
        .from('products')
        .select('price')
        .eq('is_active', true)
        .order('price', { ascending: false })
        .limit(1);

      if (priceData && priceData[0]) {
        setMaxPrice(Math.ceil(priceData[0].price));
        setPriceRange([0, Math.ceil(priceData[0].price)]);
      }
    };
    fetchFilters();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(
    async (reset = false) => {
      setLoading(true);
      const currentPage = reset ? 0 : page;

      let query = supabase
        .from('products')
        .select('*, category:categories(*), brand:brands(*)', { count: 'exact' })
        .eq('is_active', true);

      // Apply filters
      if (selectedCategories.length > 0) {
        const categoryIds = categories
          .filter((c) => selectedCategories.includes(c.slug))
          .map((c) => c.id);
        if (categoryIds.length > 0) {
          query = query.in('category_id', categoryIds);
        }
      }

      if (selectedBrands.length > 0) {
        const brandIds = brands
          .filter((b) => selectedBrands.includes(b.slug))
          .map((b) => b.id);
        if (brandIds.length > 0) {
          query = query.in('brand_id', brandIds);
        }
      }

      if (priceRange[0] > 0) {
        query = query.gte('price', priceRange[0]);
      }
      if (priceRange[1] < maxPrice) {
        query = query.lte('price', priceRange[1]);
      }

      if (minRating > 0) {
        query = query.gte('rating_average', minRating);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Sort
      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating_average', { ascending: false });
          break;
        case 'popular':
          query = query.order('rating_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      query = query.range(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE - 1
      );

      const { data, count } = await query;

      if (data) {
        if (reset) {
          setProducts(data);
          setPage(0);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }
        setTotalCount(count || 0);
        setHasMore(data.length === ITEMS_PER_PAGE);
      }

      setLoading(false);
    },
    [
      page,
      selectedCategories,
      selectedBrands,
      priceRange,
      minRating,
      sortBy,
      searchQuery,
      categories,
      brands,
      maxPrice,
    ]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(0);
    fetchProducts(true);
  }, [
    selectedCategories,
    selectedBrands,
    priceRange,
    minRating,
    sortBy,
    searchQuery,
  ]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchProducts();
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  const toggleBrand = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setSearchQuery('');
  };

  const activeFilters =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange[1] < maxPrice ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => toggleCategory(category.slug)}
              />
              <Label
                htmlFor={`cat-${category.slug}`}
                className="text-sm cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-4">Brands</h3>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.slug}`}
                checked={selectedBrands.includes(brand.slug)}
                onCheckedChange={() => toggleBrand(brand.slug)}
              />
              <Label
                htmlFor={`brand-${brand.slug}`}
                className="text-sm cursor-pointer"
              >
                {brand.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={maxPrice}
          step={10}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-4">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating === minRating ? 0 : rating)}
              className={cn(
                'flex items-center gap-2 text-sm',
                minRating === rating && 'text-orange'
              )}
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted'
                    )}
                  />
                ))}
              </div>
              <span className="text-muted-foreground">& up</span>
            </button>
          ))}
        </div>
      </div>

      {activeFilters > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Shop</h1>
            <p className="text-muted-foreground">
              {totalCount} {totalCount === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="hidden md:flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>

            {/* Mobile Filters */}
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilters > 0 && (
                    <span className="ml-1 bg-orange text-white text-xs px-1.5 rounded-full">
                      {activeFilters}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {activeFilters > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {selectedCategories.map((slug) => {
                const cat = categories.find((c) => c.slug === slug);
                return cat ? (
                  <Button
                    key={slug}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleCategory(slug)}
                    className="h-7"
                  >
                    {cat.name}
                    <X className="w-3 h-3 ml-1" />
                  </Button>
                ) : null;
              })}
              {selectedBrands.map((slug) => {
                const brand = brands.find((b) => b.slug === slug);
                return brand ? (
                  <Button
                    key={slug}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleBrand(slug)}
                    className="h-7"
                  >
                    {brand.name}
                    <X className="w-3 h-3 ml-1" />
                  </Button>
                ) : null;
              })}
              <Button
                variant="link"
                size="sm"
                onClick={clearFilters}
                className="h-7"
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading && products.length === 0 ? (
              <div
                className={cn(
                  'grid gap-4 lg:gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-2 md:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-square skeleton rounded-2xl" />
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div
                  className={cn(
                    'grid gap-4 lg:gap-6',
                    viewMode === 'grid'
                      ? 'grid-cols-2 md:grid-cols-3'
                      : 'grid-cols-1'
                  )}
                >
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-12 text-center">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="min-w-[200px]"
                    >
                      {loading ? (
                        'Loading...'
                      ) : (
                        <>
                          Load More
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20">Loading...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
