"use client";

import React, { useRef, useState, useEffect } from "react";

interface MagicBentoProps {
  children?: React.ReactNode;
  className?: string;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string; // Format: "R, G, B"
  disableAnimations?: boolean;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function MagicBento({
  children,
  className = "",
  textAutoHide = false,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false,
  clickEffect = false,
  spotlightRadius = 400,
  particleCount = 12,
  glowColor = "120, 120, 120", // Default greyish
  disableAnimations = false,
  title,
  description,
  icon,
}: MagicBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [stars, setStars] = useState<
    { x: number; y: number; size: number; opacity: number; duration: number }[]
  >([]);

  useEffect(() => {
    if (enableStars) {
      const newStars = Array.from({ length: particleCount }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        duration: Math.random() * 3 + 2,
      }));
      setStars(newStars);
    }
  }, [enableStars, particleCount]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || disableAnimations) return;

    const rect = containerRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setOpacity(1);
    setIsHovered(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setOpacity(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm transition-all duration-300 ${className}`}
      style={{
        transform:
          enableTilt && isHovered
            ? "perspective(1000px) rotateX(1deg) rotateY(1deg)"
            : "none",
        zIndex: isHovered ? 10 : 1,
      }}
    >
      {/* Border Glow Effect */}
      {enableBorderGlow && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300"
          style={{
            opacity: opacity,
            background: `radial-gradient(${spotlightRadius}px circle at ${position.x}px ${position.y}px, rgba(${glowColor}, 0.15), transparent 40%)`,
          }}
        />
      )}

      {/* Spotlight Effect */}
      {enableSpotlight && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300"
          style={{
            opacity: opacity,
            background: `radial-gradient(${spotlightRadius}px circle at ${position.x}px ${position.y}px, rgba(${glowColor}, 0.05), transparent 60%)`,
          }}
        />
      )}

      {/* Stars Effect */}
      {enableStars && isHovered && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-current transition-opacity duration-1000"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: `rgb(${glowColor})`,
                opacity: isHovered ? star.opacity : 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children || (
          <div className="p-6 h-full flex flex-col">
            {icon && (
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300"
                style={{
                  backgroundColor: `rgba(${glowColor}, 0.1)`,
                  color: `rgb(${glowColor})`,
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                }}
              >
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
