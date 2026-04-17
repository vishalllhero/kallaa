import ImageWithFallback from '@/components/ImageWithFallback';

export default function ImageTest() {
  const testUrls = [
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400', // Working external URL
    '/uploads/test-image.jpg', // Local upload path (should be proxied)
    'https://picsum.photos/400/600?random=1', // Another external URL
  ];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold text-white">Image Test Component</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testUrls(Array.isArray(data) ? data : []).map(...)
          (Array.isArray(orders) ? orders : []).map(...)
          (Array.isArray(items) ? items : []).map(...)(url, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-white">Test Image {index + 1}</h3>
          <p className="text-zinc-400 text-sm break-all">URL: {url}</p>

          <div className="w-64 h-96 border border-zinc-600 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={url}
              alt={`Test ${index + 1}`}
              className="w-full h-full object-cover"
              debug={true}
            />
          </div>

          {/* Raw img for comparison */}
          <div className="w-64 h-32 border border-zinc-600 rounded-lg overflow-hidden">
            <img
              src={url}
              alt={`Raw ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => console.log('Raw image error:', url)}
              onLoad={() => console.log('Raw image loaded:', url)}
            />
          </div>
          <p className="text-zinc-500 text-xs">Raw img above</p>
        </div>
        ))}
      </div>

      {/* Environment info */}
      <div className="bg-zinc-800 p-4 rounded-lg">
        <h3 className="text-white mb-2">Environment Info</h3>
        <div className="text-zinc-300 text-sm space-y-1">
          <div>Mode: {import.meta.env.MODE}</div>
          <div>Dev: {import.meta.env.DEV ? 'true' : 'false'}</div>
          <div>Prod: {import.meta.env.PROD ? 'true' : 'false'}</div>
          <div>Vite Proxy should handle /uploads → http://localhost:5000</div>
        </div>
      </div>
    </div>
  );
}