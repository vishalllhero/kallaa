import React from "react";
import { ChevronRight, ArrowRight, Play } from "lucide-react";
import { Link } from "wouter";
import { productApi } from "@/api";
import { motion, useScroll, useTransform } from "framer-motion";
import ImageWithFallback from "@/components/ImageWithFallback";
import ProductCard from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { getProductImage, debugImageInfo } from "@/utils/image";
import { safeMap } from "@/utils/safeMap";
import { formatPrice } from "@/utils/formatPrice";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
  const [collectedStories, setCollectedStories] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch featured products (available ones)
        const productsResponse = await productApi
          .getAll()
          .catch(() => ({ data: [] }));
        const productsData =
          productsResponse?.data?.data ||
          productsResponse?.data?.products ||
          productsResponse?.data ||
          [];
        const productsArray = Array.isArray(productsData) ? productsData : [];
        setFeaturedProducts(productsArray.filter(p => !p?.isSold).slice(0, 4));

        // Fetch collected stories
        const storiesResponse = await productApi
          .getStories()
          .catch(() => ({ data: [] }));
        const storiesData =
          storiesResponse?.data?.data || storiesResponse?.data || [];
        const storiesArray = Array.isArray(storiesData) ? storiesData : [];
        setCollectedStories(storiesArray.slice(0, 2));
      } catch (err) {
        console.error("Data fetch error:", err);
        setFeaturedProducts([]);
        setCollectedStories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-400 selection:text-black">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container relative z-20 text-center px-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="inline-block text-[#d4af37] uppercase text-sm mb-6 font-medium tracking-widest"
            style={{ textShadow: "0 0 10px rgba(212, 175, 55, 0.5)" }}
          >
            Exclusive Atelier
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-6xl font-serif mb-8 leading-tight tracking-tight text-white"
            style={{ textShadow: "0 0 20px rgba(0, 0, 0, 0.8)" }}
          >
            Owned by a <span className="italic text-[#d4af37]">few</span>,{" "}
            <br />
            not by everyone.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="max-w-xl mx-auto text-zinc-300 text-lg md:text-xl mb-12 font-light leading-relaxed"
            style={{ textShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}
          >
            This is not mass-produced. Each piece is hand-painted and exists
            only once. A testament to rarity and artistic revolution.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              href="/products"
              className="px-10 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:bg-[#e8c547] hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 rounded-full flex items-center justify-center gap-2 group"
            >
              Explore Collection{" "}
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/stories"
              className="px-10 py-4 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 rounded-full uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              Collected Stories <Play size={16} fill="white" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-32 bg-zinc-900/50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Featured Collection
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Discover pieces that tell stories of creativity, passion, and
              artistic vision.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : !Array.isArray(featuredProducts) ||
            featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-8">🎨</div>
              <h3 className="text-2xl font-serif text-zinc-400 mb-4">
                Featured pieces coming soon
              </h3>
              <p className="text-zinc-600">
                Our latest collection is being prepared. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(Array.isArray(featuredProducts) ? featuredProducts : []).map(
                (product, idx) => (
                  <motion.div
                    key={product.id || product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                )
              )}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:bg-[#e8c547] transition-all rounded-full"
            >
              Explore Full Collection
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Collected Stories Section */}
      <section className="py-32 bg-black">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
              Collected Stories
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Every piece finds its home. Here are the stories of collectors who
              found their perfect match.
            </p>
          </div>

          {!Array.isArray(collectedStories) || collectedStories.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-8">🎨</div>
              <h3 className="text-2xl font-serif text-zinc-400 mb-4">
                Stories coming soon
              </h3>
              <p className="text-zinc-600">
                Be the first to collect a piece and share your story.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {(Array.isArray(collectedStories) ? collectedStories : []).map(
                (story, idx) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-zinc-900/30 p-8 rounded-2xl border border-white/5"
                  >
                    <div className="flex gap-6 mb-6">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800">
                        <div className="w-full h-full bg-gradient-to-br from-[#d4af37] to-[#e8c547] flex items-center justify-center">
                          <span className="text-black font-bold text-lg">
                            {(story.ownerName || "A")[0].toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-serif text-lg mb-1">
                          {story.ownerName || "Anonymous Collector"}
                        </h3>
                        <p className="text-zinc-500 text-sm">
                          {story.soldAt
                            ? new Date(story.soldAt).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                    </div>
                    {story.ownerStory && (
                      <blockquote className="text-zinc-300 italic mb-4">
                        "{story.ownerStory}"
                      </blockquote>
                    )}
                    <div className="text-[#d4af37] text-sm uppercase tracking-wider">
                      "{story.title || story.name}" by KALLAA
                    </div>
                  </motion.div>
                )
              )}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/stories"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all rounded-full uppercase tracking-widest text-sm"
            >
              Read More Stories
              <Play size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-zinc-900/50 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-12 text-white">
            The Philosophy of Rarity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <div className="space-y-4">
              <span className="text-2xl font-serif text-[#d4af37]">01.</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                Unique Identity
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                No two pieces are ever the same. Your collection is as unique as
                your own thumbprint.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-2xl font-serif text-[#d4af37]">02.</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                Hand-Crafted
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                Painstakingly hand-painted over weeks. We value human
                imperfection over machine precision.
              </p>
            </div>
            <div className="space-y-4">
              <span className="text-2xl font-serif text-[#d4af37]">03.</span>
              <h3 className="text-xl font-bold uppercase tracking-wide text-white">
                Limited Ownership
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                Once a piece is collected, it is gone forever. Only 100 pieces
                are released each year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="py-32 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif">
                Latest Arrivals
              </h2>
              <p className="text-zinc-500 mt-4">
                Discover the newest unique pieces before they are gone.
              </p>
            </div>
            <Link
              href="/products"
              className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 uppercase tracking-widest text-sm font-bold"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : !Array.isArray(featuredProducts) ||
            featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-8">🎨</div>
              <h3 className="text-2xl font-serif text-zinc-400 mb-4">
                Featured pieces coming soon
              </h3>
              <p className="text-zinc-600">
                Our latest collection is being prepared. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {(Array.isArray(featuredProducts) ? featuredProducts : []).map(
                (p, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    key={p.id || p._id}
                  >
                    <Link href={`/product/${p.id}`} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6 bg-zinc-900 border border-white/5">
                        <ImageWithFallback
                          src={
                            p.images?.[0] ||
                            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600"
                          }
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {p.isSold === 1 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <span className="px-4 py-2 border border-white/40 rounded-full text-[10px] uppercase tracking-widest">
                              Collected
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                          {p.isSold === 1 ? (
                            <span className="text-gray-500 text-sm">COLLECTED</span>
                          ) : (
                            <span className="text-gold font-serif text-xl">
                              {formatPrice(3000)}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-zinc-400 text-lg font-medium group-hover:text-white transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-zinc-600 font-serif text-sm mt-1">
                        {p.isSold ? "Private Collection" : "Ready to Collect"}
                      </p>
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Final Brand Message */}
      <section className="py-48 px-4 text-center">
        <div className="container max-w-4xl mx-auto space-y-12">
          <blockquote className="text-3xl md:text-5xl font-serif italic leading-relaxed text-zinc-200">
            "We believe that true luxury is not about price, it's about the
            impossibility of replication."
          </blockquote>
          <p className="text-zinc-500 uppercase tracking-[0.4em] text-sm">
            Founded in Kallaa, 2026
          </p>
          <div className="pt-8">
            <Link
              href="/products"
              className="inline-block px-12 py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-full"
            >
              Begin Your Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-serif text-white mb-4">
                KALL<span className="text-[#d4af37]">AA</span>
              </h3>
              <p className="text-zinc-400 leading-relaxed max-w-md">
                A sanctuary for the extraordinary. Where art meets exclusivity,
                and every piece tells a story of rarity and craftsmanship.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-sm">
                Collection
              </h4>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <Link
                    href="/products"
                    className="hover:text-[#d4af37] transition-colors"
                  >
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stories"
                    className="hover:text-[#d4af37] transition-colors"
                  >
                    Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="hover:text-[#d4af37] transition-colors"
                  >
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-sm">
                Connect
              </h4>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <a
                    href="mailto:info@kallaa.com"
                    className="hover:text-[#d4af37] transition-colors"
                  >
                    info@kallaa.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+1234567890"
                    className="hover:text-[#d4af37] transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-[#d4af37] transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-8 text-center">
            <p className="text-zinc-500 text-sm">
              © 2026 KALLAA. All rights reserved. | Crafted with precision.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
