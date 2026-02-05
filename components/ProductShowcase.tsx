"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Product } from "./ProductCard";

const products: Product[] = [
  {
    id: "1",
    name: "Spinach Bunch",
    category: "Vegetable",
    price: "$2.50",
    badge: "Farm Fresh",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "2",
    name: "Red Apples",
    category: "Fruit",
    price: "$4.00",
    badge: "Organic",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "3",
    name: "Vine Tomatoes",
    category: "Vegetable",
    price: "$3.20",
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "4",
    name: "Alfonso Mango",
    category: "Fruit",
    price: "$8.00",
    badge: "Seasonal",
    image:
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "5",
    name: "Fresh Wheat",
    category: "Grocery",
    price: "$5.00",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "6",
    name: "Ripe Avocado",
    category: "Fruit",
    price: "$6.50",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1523049673856-42868ac6919f?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "7",
    name: "Crunchy Carrots",
    category: "Vegetable",
    price: "$1.80",
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(3);

  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % products.length);
  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);

  return (
    <section className="bg-background min-h-[80vh] flex flex-col items-center justify-center py-24 relative overflow-hidden">
      {/* Header Content */}
      <div className="relative z-10 text-center mb-20 px-4 space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-primary font-medium tracking-widest text-xs uppercase mb-3 block">
            Premium Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-dark tracking-tight mb-4">
            Nature’s Finest Gallery
          </h2>
          <p className="text-gray-500 font-light leading-relaxed">
            Curated directly from our partner farms to your table.
          </p>
        </motion.div>
      </div>

      {/* 3D Carousel Stage */}
      <div className="relative w-full h-[600px] flex items-center justify-center perspective-container">
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center preserve-3d">
          <AnimatePresence>
            {products.map((product, index) => {
              // Calculate visual position relative to active index
              // This creates a circular/infinite feel logic window
              let offset = index - activeIndex;

              // Visual clamp to keep items in view reasonably
              if (offset > 3) offset -= products.length;
              if (offset < -3) offset += products.length;

              const isActive = offset === 0;
              const absOffset = Math.abs(offset);

              // Don't render items too far away to keep DOM clean
              if (absOffset > 3) return null;

              return (
                <motion.div
                  key={product.id}
                  layout="position"
                  className="absolute w-[320px] md:w-[380px] aspect-[4/5] rounded-[2rem] bg-white origin-center cursor-pointer select-none"
                  style={{
                    zIndex: 100 - absOffset,
                    boxShadow: isActive
                      ? "0 35px 60px -15px rgba(0, 0, 0, 0.2)"
                      : "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                  }}
                  initial={false}
                  animate={{
                    // The Curve: X spreads out, Y keeps centered
                    // Z pushes back significantly as we go out
                    x: `${offset * 60}%`,
                    y: isActive ? "0%" : "5%",
                    scale: isActive ? 1.15 : 1 - absOffset * 0.15,
                    rotateY: `${offset * -25}deg`, // Rotate inwards to face center
                    z: `${Math.abs(offset) * -300}px`,
                    opacity: isActive ? 1 : Math.max(0.4, 1 - absOffset * 0.3),
                    filter: isActive ? "blur(0px)" : `blur(${absOffset * 3}px)`,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    mass: 1.2,
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Card Content */}
                  <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white">
                    <div className="h-[75%] w-full relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                      {/* Gradient overlay for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {product.badge && (
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-primary tracking-wider uppercase shadow-sm">
                          {product.badge}
                        </div>
                      )}
                    </div>
                    <div className="h-[25%] p-6 flex flex-col justify-center bg-white border-t border-gray-50">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            {product.category}
                          </p>
                          <h3 className="text-2xl font-serif font-bold text-gray-900 leading-tight">
                            {product.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-medium text-primary-dark">
                            {product.price}
                          </p>
                          <div className="flex text-amber-400 text-[10px] gap-0.5 mt-1">
                            <Star fill="currentColor" size={12} />
                            <Star fill="currentColor" size={12} />
                            <Star fill="currentColor" size={12} />
                            <Star fill="currentColor" size={12} />
                            <Star fill="currentColor" size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-800 shadow-lg hover:scale-110 transition-transform z-50 border border-white"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-800 shadow-lg hover:scale-110 transition-transform z-50 border border-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-12 text-center">
        <button className="px-10 py-4 bg-primary-dark text-white rounded-full font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          Shop Collection
        </button>
      </div>

      <style jsx>{`
        .perspective-container {
          perspective: 2000px; /* Stronger perspective for depth */
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}
