"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop",
    alt: "Gym training",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500&h=300&fit=crop",
    alt: "Athlete training",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1461897104934-dce0a28276e6?w=500&h=300&fit=crop",
    alt: "Stadium",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1461912390831-6aee6fbb3c21?w=500&h=300&fit=crop",
    alt: "Soccer player",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1476480862245-80cab078891f?w=500&h=300&fit=crop",
    alt: "Indoor stadium",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop",
    alt: "Runner",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1521575107034-e3fb11b08e15?w=500&h=300&fit=crop",
    alt: "Team sports",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500&h=300&fit=crop",
    alt: "Fitness",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1476480862245-80cab078891f?w=500&h=300&fit=crop",
    alt: "Training facility",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1461912390831-6aee6fbb3c21?w=500&h=300&fit=crop",
    alt: "Sports action",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=500&h=300&fit=crop",
    alt: "Athlete",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop",
    alt: "Sports event",
  },
];

export default function Gallery() {
  return (
    <div className="rounded-lg bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
        <Button
          variant="outline"
          className="border-primary bg-primary text-primary-foreground hover:bg-primary/90"
        >
          More photos
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {galleryImages.map((image) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-lg"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
