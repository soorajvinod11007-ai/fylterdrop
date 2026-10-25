"use client";

import Image from "next/image";
import { Card, Carousel } from "@/components/ui/apple-cards-carousel";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
}

export default function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  const cards = images.map((image, index) => (
    <Card
      key={`${image}-${index}`}
      index={index}
      className="h-[min(76vw,32rem)] w-[min(76vw,28rem)] md:h-[min(66vh,40rem)] md:w-[min(42vw,30rem)]"
      card={{
        category: `Image ${index + 1} of ${images.length}`,
        title: productName,
        src: image,
        content: (
          <div className="relative mx-auto h-[65vh] min-h-80 w-full max-w-3xl">
            <Image
              src={image}
              alt={`${productName}, image ${index + 1}`}
              fill
              unoptimized
              sizes="(max-width: 768px) 90vw, 768px"
              className="object-contain"
            />
          </div>
        ),
      }}
    />
  ));

  return (
    <section aria-label={`${productName} product images`}>
      <Carousel items={cards} />
      {images.length > 1 && (
        <p className="px-4 text-center text-xs text-fylter-muted">
          Swipe or use the arrows to explore product images
        </p>
      )}
    </section>
  );
}
