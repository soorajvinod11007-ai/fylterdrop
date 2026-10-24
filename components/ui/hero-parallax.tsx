"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export type HeroParallaxProduct = {
  title: string;
  link: string;
  thumbnail: string;
};

export const HeroParallax = ({
  products,
  header,
}: {
  products: HeroParallaxProduct[];
  header?: React.ReactNode;
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const hasProducts = products.length > 0;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig,
  );

  return (
    <div
      ref={ref}
      className={
        shouldReduceMotion || !hasProducts
          ? "relative overflow-hidden bg-fylter-offWhite py-16 antialiased md:py-24"
          : "relative flex h-[300vh] flex-col self-auto overflow-hidden bg-fylter-offWhite py-24 antialiased [perspective:1000px] [transform-style:preserve-3d] md:py-40"
      }
    >
      {header ?? <Header />}
      {shouldReduceMotion ? (
        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-2 gap-4 px-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.slice(0, 10).map((product, index) => (
            <Link
              key={`${product.link}-${index}`}
              href={product.link}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-fylter-darkest/80 to-transparent p-3 text-sm text-white">
                {product.title}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
        >
          <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
            {firstRow.map((product, index) => (
              <ParallaxProductCard
                product={product}
                translate={translateX}
                key={`${product.link}-1-${index}`}
              />
            ))}
          </motion.div>
          <motion.div className="mb-20 flex flex-row space-x-20">
            {secondRow.map((product, index) => (
              <ParallaxProductCard
                product={product}
                translate={translateXReverse}
                key={`${product.link}-2-${index}`}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
            {thirdRow.map((product, index) => (
              <ParallaxProductCard
                product={product}
                translate={translateX}
                key={`${product.link}-3-${index}`}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export const Header = () => {
  return (
    <div className="relative left-0 top-0 mx-auto w-full max-w-7xl px-4 py-16 md:py-40">
      <h1 className="font-heading text-4xl font-medium text-fylter-darkText md:text-7xl">
        Good things for your
        <br />
        <em className="italic text-fylter-gold">little world.</em>
      </h1>
      <p className="mt-8 max-w-2xl text-base text-fylter-secondary md:text-xl">
        A happy place for pretty paper, feel-good finds, and clever things for every day.
      </p>
    </div>
  );
};

export const ProductCard = ParallaxProductCard;

function ParallaxProductCard({
  product,
  translate,
}: {
  product: HeroParallaxProduct;
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="group/product relative h-96 w-[30rem] shrink-0"
    >
      <Link
        href={product.link}
        className="block h-full w-full overflow-hidden rounded-2xl group-hover/product:shadow-2xl"
      >
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          unoptimized
          sizes="480px"
          className="absolute inset-0 h-full w-full object-cover object-left-top"
        />
      </Link>
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded-2xl bg-fylter-darkest opacity-0 transition-opacity group-hover/product:opacity-80" />
      <h2 className="absolute bottom-4 left-4 text-white opacity-0 transition-opacity group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  );
}
