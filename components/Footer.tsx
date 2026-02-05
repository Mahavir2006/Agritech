"use client";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "./ui/Button";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Ready to eat fresh?</h2>
            <p className="text-white/70">
              Download the app and get $10 off your first order.
            </p>
          </div>
          <Button size="lg" variant="secondary">
            Download App
          </Button>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-white/50">
            © 2024 AgriBridge. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Instagram className="h-5 w-5 text-white/70 hover:text-white cursor-pointer" />
            <Twitter className="h-5 w-5 text-white/70 hover:text-white cursor-pointer" />
            <Facebook className="h-5 w-5 text-white/70 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
