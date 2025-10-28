"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const galleryImages = [
  {
    id: 1,
    src: "/gallery/g1.png",
    alt: "Gym training",
  },
  {
    id: 2,
    src: "/gallery/g2.png",
    alt: "Athlete training",
  },
  {
    id: 3,
    src: "/gallery/g3.png",
    alt: "Stadium",
  },
  {
    id: 4,
    src: "/gallery/g4.png",
    alt: "Soccer player",
  },
  {
    id: 5,
    src: "/gallery/g5.png",
    alt: "Indoor stadium",
  },
  {
    id: 6,
    src: "/gallery/g6.png",
    alt: "Runner",
  },
  {
    id: 7,
    src: "/gallery/g7.png",
    alt: "Team sports",
  },
  {
    id: 8,
    src: "/gallery/g8.png",
    alt: "Fitness",
  },
  {
    id: 9,
    src: "/gallery/g9.png",
    alt: "Training facility",
  },
  {
    id: 10,
    src: "/gallery/g10.png",
    alt: "Sports action",
  },
  {
    id: 11,
    src: "/gallery/g11.png",
    alt: "Athlete",
  },
  {
    id: 12,
    src: "/gallery/g12.png",
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
            className="group relative h-40 overflow-hidden rounded-lg"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
          </div>
        ))}
      </div>
    </div>
  );
}
