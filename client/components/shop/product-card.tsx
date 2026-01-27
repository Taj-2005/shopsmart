"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  alt: string;
  category?: string;
  index?: number;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  alt,
  category,
  index = 0,
}: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group"
    >
      <Link
        href={`/shop?p=${id}`}
        className="block rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <div className="relative aspect-square overflow-hidden bg-[var(--accent)]">
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          {category ? (
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              {category}
            </p>
          ) : null}
          <h3 className="mt-1 font-heading font-semibold text-[var(--foreground)] line-clamp-2">
            {name}
          </h3>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
            {price}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
