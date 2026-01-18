import ImageGallery from "@/components/ImageGallery";

interface HeroSectionProps {
  date: string; // Format: "DD • MM • YYYY"
  altText?: string;
}

const images: string[] = [
  "/images/A-147.jpg",
  "/images/A-180.jpg",
  "/images/A-194.jpg",
  "/images/A-254.jpg",
  "/images/A-44.jpg",
  "/images/A-89.jpg",
];

export default function HeroSection({
  date,
  altText = "wedding",
}: HeroSectionProps) {
  return (
    <section className="py-0 px-0">
      <div className="w-full">
        <div className="relative">
          <ImageGallery images={images} alt={altText} />
          <div className="absolute inset-0 bg-black/40 z-[5] pointer-events-none" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 pointer-events-none">
            <h1 className="text-5xl md:text-7xl font-serif mb-2 tracking-tight font-normal text-white drop-shadow-lg">
              DAMOLA & JOÃO
            </h1>
            <div className="text-md md:text-lg uppercase tracking-wider font-medium font-sans text-white drop-shadow-lg">
              {date}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
