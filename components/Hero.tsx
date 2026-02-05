"use client";
import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import Magnet from "./ui/Magnet";
import ClickSpark from "./ui/ClickSpark";

export default function Hero() {
  return (
    <ClickSpark
      sparkColor="#F9E79F"
      sparkRadius={30}
      sparkCount={12}
      duration={500}
    >
      <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-background px-4 pt-20 text-center cursor-default">
        {/* Background Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute left-[10%] top-[20%] text-primary/20"
          >
            <Leaf size={48} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
            className="absolute right-[15%] top-[15%] text-primary/30"
          >
            <Leaf size={64} className="rotate-45" />
          </motion.div>
          {/* Soft heavy blur blob */}
          <div className="absolute -top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
              100% Organic & Farm Fresh
            </span>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-primary-dark sm:text-7xl md:leading-[1.1] mb-6">
              Fresh from Farms. <br />
              <span className="text-primary">Delivered to Your Door.</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
              Vegetables, Fruits & Daily Groceries — Direct from Farmers.
              Experience the taste of pure, unadulterated nature.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row relative z-20"
          >
            <Link href="/login">
              <Magnet padding={50} magnetStrength={5}>
                <Button size="lg" className="group gap-2 relative">
                  Explore Fresh Produce
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Magnet>
            </Link>
            <Link href="/login">
              <Magnet padding={40} magnetStrength={8}>
                <Button variant="outline" size="lg">
                  Become a Partner Farmer
                </Button>
              </Magnet>
            </Link>
          </motion.div>
        </div>
      </section>
    </ClickSpark>
  );
}
