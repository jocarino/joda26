import ImageGallery from "@/components/ImageGallery";

interface HeroSectionProps {
  date: string; // Format: "DD • MM • YYYY"
  images?: string[];
  altText?: string;
}

export default function HeroSection({
  date,
  images = [],
  altText = "wedding",
}: HeroSectionProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-serif mb-2 tracking-tight font-normal">
          DAMOLA & JOÃO
        </h1>
        <div className="text-md md:text-lg mb-8 uppercase tracking-wider font-sans">
          {date}
        </div>
        {images.length > 0 && <ImageGallery images={images} alt={altText} />}
      </div>
    </section>
  );
}
