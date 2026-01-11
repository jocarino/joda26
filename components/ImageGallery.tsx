interface ImageGalleryProps {
  images: string[];
  alt?: string;
}

export default function ImageGallery({ images, alt = 'Wedding photo' }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-8">
      {images.map((src, index) => (
        <div key={index} className="relative aspect-[3/4] overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 bg-gray-200">
          {/* Using regular img tag since Next.js Image requires external domain configuration */}
          <img
            src={src}
            alt={`${alt} ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

