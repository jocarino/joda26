"use client";

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 py-4 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-3 items-center">
        {/* Left: Damola & João */}
        <h1 className="text-2xl md:text-3xl font-serif">DAMOLA & JOÃO</h1>

        {/* Middle: Menu items */}
        <div className="flex gap-6 text-sm uppercase tracking-wider justify-center">
          <button
            onClick={() => scrollToSection("location")}
            className="hover:underline"
          >
            LOCATION
          </button>
          <button
            onClick={() => scrollToSection("registry")}
            className="hover:underline"
          >
            REGISTRY
          </button>
        </div>

        {/* Right: RSVP button */}
        <div className="flex justify-end">
          <button
            onClick={() => scrollToSection("rsvp")}
            className="text-sm uppercase tracking-wider border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
          >
            RSVP
          </button>
        </div>
      </div>
    </nav>
  );
}
