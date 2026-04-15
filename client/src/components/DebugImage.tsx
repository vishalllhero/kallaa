import { useState } from 'react';
import { getImageUrl, isValidImagePath } from '@/utils/image';

interface DebugImageProps {
  images: string[] | undefined;
  title?: string;
}

export default function DebugImage({ images, title = "Debug Images" }: DebugImageProps) {
  const [showDebug, setShowDebug] = useState(false);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-sm z-50">
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="text-yellow-400 text-sm mb-2 hover:text-yellow-300"
      >
        {showDebug ? 'Hide' : 'Show'} {title}
      </button>

      {showDebug && (
        <div className="space-y-2 text-xs">
          <div>
            <strong>Raw images:</strong>
            <pre className="bg-zinc-800 p-2 rounded mt-1 text-xs overflow-x-auto">
              {JSON.stringify(images, null, 2)}
            </pre>
          </div>

          <div>
            <strong>Processed URLs:</strong>
            <div className="space-y-1">
              {images?.map((img, i) => (
                <div key={i} className="bg-zinc-800 p-2 rounded">
                  <div>Original: {img}</div>
                  <div>Processed: {getImageUrl(img)}</div>
                  <div>Valid: {isValidImagePath(img) ? '✅' : '❌'}</div>
                </div>
              )) || <div>No images</div>}
            </div>
          </div>

          <div>
            <strong>Environment:</strong>
            <div>DEV: {import.meta.env.DEV ? 'true' : 'false'}</div>
            <div>Backend URL: http://localhost:5000</div>
          </div>
        </div>
      )}
    </div>
  );
}