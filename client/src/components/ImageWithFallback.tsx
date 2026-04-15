import { useState, useEffect } from 'react';
import { getImageUrl, createImageLoadState, handleImageLoad, handleImageError, cn, IMAGE_CONFIG } from '@/utils/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  containerClassName?: string;
  debug?: boolean;
  priority?: boolean; // For above-the-fold images
  sizes?: string; // For responsive images
}

export default function ImageWithFallback({
  src: originalSrc,
  alt,
  className = '',
  containerClassName = '',
  fallbackSrc = IMAGE_CONFIG.fallback,
  onError,
  debug = false,
  priority = false,
  sizes
}: ImageWithFallbackProps) {
  const [loadState, setLoadState] = useState(() => createImageLoadState());
  const [currentSrc, setCurrentSrc] = useState<string>('');

  // Process the src URL using centralized utility
  const processedSrc = getImageUrl(originalSrc);

  // Reset state when src changes
  useEffect(() => {
    const newProcessedSrc = getImageUrl(originalSrc);
    setLoadState(createImageLoadState());
    setCurrentSrc(newProcessedSrc);

    if (debug) {
      console.log('[ImageWithFallback] Processing:', originalSrc, '->', newProcessedSrc);
    }
  }, [originalSrc, debug]);

  const handleLoadSuccess = () => {
    setLoadState(prev => {
      const newState = { ...prev };
      handleImageLoad(newState);
      return newState;
    });

    if (debug) {
      console.log('[ImageWithFallback] ✅ Loaded successfully:', currentSrc);
    }
  };

  const handleLoadError = () => {
    if (debug) {
      console.error('[ImageWithFallback] ❌ Load failed:', currentSrc);
    }

    if (!loadState.error) {
      // First error: switch to fallback
      setLoadState(prev => {
        const newState = { ...prev };
        handleImageError(newState);
        return newState;
      });
      setCurrentSrc(fallbackSrc);
      onError?.();
    } else {
      // Fallback also failed
      setLoadState(prev => {
        const newState = { ...prev };
        newState.loading = false;
        return newState;
      });
    }
  };

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Loading State */}
      {loadState.loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            'w-full h-full rounded-lg',
            IMAGE_CONFIG.loadingBg,
            IMAGE_CONFIG.loadingPulse
          )} />
        </div>
      )}

      {/* Image */}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          className,
          loadState.loading && 'opacity-0',
          !loadState.loading && 'opacity-100',
          'transition-opacity duration-300 ease-in-out'
        )}
        onLoad={handleLoadSuccess}
        onError={handleLoadError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        style={{ display: 'block' }}
      />

      {/* Error State */}
      {loadState.error && !loadState.loading && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center rounded-lg border',
          IMAGE_CONFIG.errorBg,
          IMAGE_CONFIG.errorBorder
        )}>
          <div className="text-center p-4">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-sm">!</span>
            </div>
            <span className={cn('text-xs', IMAGE_CONFIG.errorText)}>
              Image unavailable
            </span>
          </div>
        </div>
      )}
    </div>
  );
}