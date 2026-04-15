import React from 'react';
import { ChevronRight, ArrowRight, Play } from 'lucide-react';
import { Link } from 'wouter';
import { productApi } from '@/api';
import { motion, useScroll, useTransform } from 'framer-motion';
import ImageWithFallback from '@/components/ImageWithFallback';
import { getProductImage, debugImageInfo } from '@/utils/image';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productApi.getAll();
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-400 selection:text-black">
      
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
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
            initial={{ opacity: 0, letterSpacing: "1em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1 }}
            className="inline-block text-yellow-400 uppercase text-sm mb-6"
          >
            Exclusive Atelier
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-9xl font-serif mb-8 leading-tight tracking-tight"
          >
            Owned by a <span className="italic text-yellow-500">few</span>, <br />
            not by everyone.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="max-w-xl mx-auto text-zinc-400 text-lg md:text-xl mb-12 font-light leading-relaxed"
          >
            This is not mass-produced. Each piece is hand-painted and exists only once. 
            A testament to rarity and artistic revolution.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link href="/products" className="px-10 py-4 bg-yellow-400 text-black font-bold uppercase tracking-widest hover:bg-yellow-300 transition-all rounded-full flex items-center justify-center gap-2 group">
              Explore Collection <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/stories" className="px-10 py-4 border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all rounded-full uppercase tracking-widest text-sm flex items-center justify-center gap-2">
              Collected Stories <Play size={16} fill="white" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-white text-black">
        <div className="container px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-12">The Philosophy of Rarity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <div className="space-y-4">
              <span className="text-2xl font-serif text-yellow-600">01.</span>
              <h3 className="text-xl font-bold uppercase tracking-wide">Unique Identity</h3>
              <p className="text-zinc-600 leading-relaxed">No two pieces are ever the same. Your collection is as unique as your own thumbprint.</p>
            </div>
            <div className="space-y-4">
              <span className="text-2xl font-serif text-yellow-600">02.</span>
              <h3 className="text-xl font-bold uppercase tracking-wide">Hand-Crafted</h3>
              <p className="text-zinc-600 leading-relaxed">Painstakingly hand-painted over weeks. We value human imperfection over machine precision.</p>
            </div>
            <div className="space-y-4">
              <span className="text-2xl font-serif text-yellow-600">03.</span>
              <h3 className="text-xl font-bold uppercase tracking-wide">Limited Ownership</h3>
              <p className="text-zinc-600 leading-relaxed">Once a piece is collected, it is gone forever. Only 100 pieces are released each year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="py-32 px-4 bg-[#0a0a0a]">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif">Latest Arrivals</h2>
              <p className="text-zinc-500 mt-4">Discover the newest unique pieces before they are gone.</p>
            </div>
            <Link href="/products" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 uppercase tracking-widest text-sm font-bold">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-[3/4] bg-zinc-900 animate-pulse rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {featuredProducts?.map((p, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  key={p.id}
                >
                  <Link href={`/product/${p.id}`} className="group block">
                     <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6 bg-zinc-900 border border-white/5">
                       <ImageWithFallback
                         src={p.images?.[0] || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600'}
                         alt={p.name}
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                       />
                      {p.isSold === 1 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                          <span className="px-4 py-2 border border-white/40 rounded-full text-[10px] uppercase tracking-widest">Collected</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                        <span className="text-white font-serif text-xl">${parseFloat(p.price).toLocaleString()}</span>
                      </div>
                    </div>
                    <h3 className="text-zinc-400 text-lg font-medium group-hover:text-white transition-colors">{p.name}</h3>
                    <p className="text-zinc-600 font-serif text-sm mt-1">{p.isSold ? 'Private Collection' : 'Ready to Collect'}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Final Brand Message */}
      <section className="py-48 px-4 text-center">
        <div className="container max-w-4xl mx-auto space-y-12">
          <blockquote className="text-3xl md:text-5xl font-serif italic leading-relaxed text-zinc-200">
            "We believe that true luxury is not about price, it's about the impossibility of replication."
          </blockquote>
          <p className="text-zinc-500 uppercase tracking-[0.4em] text-sm">Founded in Kallaa, 2026</p>
          <div className="pt-8">
             <Link href="/products" className="inline-block px-12 py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-full">
              Begin Your Collection
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
