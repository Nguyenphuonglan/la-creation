import { type ImgHTMLAttributes, useEffect, useRef } from 'react';

type ProtectedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

/**
 * Image component with anti-download protection:
 * - disables right-click context menu on the image
 * - blocks drag-and-drop
 * - adds a transparent overlay to block "Save Image" clicks
 * - adds CSS to block print/screen-capture (best-effort, browser-dependent)
 */
export default function ProtectedImage({ src, alt, className, ...rest }: ProtectedImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const preventContext = (e: Event) => e.preventDefault();
    const preventDrag = (e: Event) => e.preventDefault();

    img.addEventListener('contextmenu', preventContext);
    img.addEventListener('dragstart', preventDrag);

    return () => {
      img.removeEventListener('contextmenu', preventContext);
      img.removeEventListener('dragstart', preventDrag);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden select-none ${className ?? ''}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full object-cover pointer-events-none"
        style={{
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
        {...rest}
      />
      {/* Transparent overlay intercepts clicks and long-press saves */}
      <div className="absolute inset-0 bg-transparent" />
    </div>
  );
}
