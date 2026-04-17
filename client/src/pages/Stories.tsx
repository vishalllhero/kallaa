import { useEffect, useState } from "react";
import { Link } from "wouter";
import { productApi } from "@/api";
import { Star, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import ImageWithFallback from "@/components/ImageWithFallback";
import { safeMap } from "@/utils/safeMap";

export default function Stories() {
  const [collectedPieces, setCollectedPieces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const data = await productApi.getStories();
        setCollectedPieces(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        toast.error("Failed to load archive");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-24">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-yellow-500 font-bold mb-6">
            Archive
          </h2>
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8">
            Collected <span className="italic text-zinc-500">Stories</span>
          </h1>
          <p className="text-zinc-400 text-xl leading-relaxed font-light">
            Once a piece is acquired, its story continues with its curator. This
            archive commemorates the joining of high-art and unique identity.
          </p>
        </div>

        {loading ? (
          <div className="space-y-32">
            {[1, 2](Array.isArray(data) ? data : []).map(...)
              (Array.isArray(orders) ? orders : []).map(...)
              (Array.isArray(items) ? items : []).map(...)i => (
            <div
              key={i}
              className="h-96 bg-zinc-900 animate-pulse rounded-3xl"
            />
            ))}
          </div>
        ) : !Array.isArray(collectedPieces) ? (
          <div>No Data Found</div>
        ) : (
          <div className="space-y-32">
            {safeMap(collectedPieces)(Array.isArray(data) ? data : []).map(...)
              (Array.isArray(orders) ? orders : []).map(...)
              (Array.isArray(items) ? items : []).map(...)(piece, index) => (
            <div
              key={piece.id}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-16 lg:gap-32 items-center`}
            >
              {/* Visual */}
              <div className="w-full lg:w-1/2 group">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5">
                  <ImageWithFallback
                    src={
                      piece.images?.[0] ||
                      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800"
                    }
                    alt={piece.name}
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>
              </div>

              {/* Story Content */}
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-yellow-500" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-500 font-bold">
                    Acquisition Confirmed
                  </span>
                </div>

                <h3 className="text-4xl md:text-5xl font-serif text-white mb-8 italic">
                  "{piece.name}"
                </h3>

                <div className="mb-12">
                  <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                    {piece.story ||
                      "This unique narrative has been sealed within the curator's private collection."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-12 pt-12 border-t border-white/5">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold mb-3">
                      Curator
                    </h4>
                    <p className="text-white font-serif text-2xl">
                      {piece.ownerName || "Private Representative"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold mb-3">
                      Archive Date
                    </h4>
                    <p className="text-white font-serif text-2xl">
                      {new Date(piece.updatedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {!loading && collectedPieces.length === 0 && (
          <div className="text-center py-40">
            <h3 className="text-zinc-700 text-3xl font-serif italic mb-8">
              The archive is currently empty.
            </h3>
            <Link
              href="/products"
              className="text-yellow-500 uppercase tracking-widest text-[10px] font-bold hover:text-white transition-colors"
            >
              Begin your collection →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
