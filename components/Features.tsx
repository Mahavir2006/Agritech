"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, ShieldCheck, Truck } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-background py-24">
      {/* How It Works */}
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-primary-dark sm:text-4xl">
            From Soil to Soul
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our transparent journey from the farm to your table.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Sourced from Local Farms",
              desc: "We partner directly with certified organic farmers.",
            },
            {
              icon: ShieldCheck,
              title: "Quality Checked",
              desc: "Every item undergoes a rigorous 3-step quality check.",
            },
            {
              icon: Truck,
              title: "Delivered Fresh",
              desc: "From harvest to your doorstep in under 24 hours.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon size={32} />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-800">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mt-32 container mx-auto max-w-6xl px-4 bg-accent/10 rounded-3xl p-8 sm:p-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-primary-dark sm:text-4xl">
              Why Choose KisaanSaarthi?
            </h2>
            <p className="mt-6 text-lg text-gray-700">
              We believe in fair trade and fresher food. By cutting out the
              middlemen, we ensure farmers get paid more and you get produce
              that lasts longer.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Zero Middlemen - Direct Farmer Partners",
                "Up to 30% Fairer Prices for Farmers",
                "Freshness Guarantee - or Money Back",
                "Sustainable, Eco-friendly Packaging",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-800">
                  <CheckCircle2 className="text-primary" size={20} />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gray-200"
          >
            {/* Placeholder for feature image */}
            <div className="absolute inset-0 flex items-center justify-center bg-primary/20 text-primary-dark font-bold text-2xl">
              Farmer Handshake Image
            </div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials Script */}
      <div className="mt-32 text-center container mx-auto px-4">
        <h2 className="mb-12 text-2xl font-bold text-primary-dark">
          Trusted by 10,000+ Happy Families
        </h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="italic text-gray-600">
            "The freshness is unmatched! - Sarah J."
          </div>
          <div className="italic text-gray-600">
            "Finally, vegetables that taste like vegetables. - Mike T."
          </div>
          <div className="italic text-gray-600">
            "knowing I support local farmers makes it taste better. - Pritam S."
          </div>
        </div>
      </div>
    </section>
  );
}
