"use client";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  category: "Vegetable" | "Fruit" | "Grocery";
  image: string;
  badge?: string;
  price: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative h-[360px] w-[260px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300">
      {/* Badge */}
      {product.badge && (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary backdrop-blur-sm shadow-sm">
          {product.badge}
        </div>
      )}
      {/* Image Area - Full Height with gradient overlay */}
      <div className="relative h-full w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-70" />
      </div>
      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        <div className="mb-px text-xs font-semibold uppercase tracking-wider text-accent">
          {product.category}
        </div>
        <h3 className="mb-1 text-2xl font-bold">{product.name}</h3>
        <span className="text-lg font-medium text-gray-200">
          {product.price}
        </span>
      </div>
      {/* Hover Action */}
      <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-lg hover:bg-gray-100">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
