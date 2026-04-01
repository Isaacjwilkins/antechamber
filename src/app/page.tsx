"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, FileStack, Zap, TrendingUp } from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import Background from "@/components/Background";
import Logo from "@/components/Logo";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Background />

      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-[#0a0a0f]/50">
        <nav className="mx-auto max-w-6xl px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={40} className="logo-float" />
            <span className="text-lg font-light tracking-wider text-[#c8d6e5]">
              ANTECHAMBER
            </span>
          </div>
          <a href="#contact" className="btn-secondary text-sm px-6 py-2.5">
            Get in Touch
          </a>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
          <motion.div
            className="mx-auto max-w-4xl text-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Logo */}
            <motion.div className="mb-12" variants={fadeInUp} transition={{ duration: 0.8 }}>
              <Logo size={200} className="logo-float mx-auto" />
            </motion.div>

            {/* Wordmark */}
            <motion.div variants={fadeInUp} transition={{ duration: 0.8, delay: 0.1 }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-[0.4em] uppercase gradient-text mb-4">
                Antechamber
              </h1>
              <p className="text-sm tracking-[0.4em] uppercase text-[#8395a7] opacity-60">
                Health Intelligence
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-12 text-xl sm:text-2xl text-[#8395a7] font-light leading-relaxed max-w-2xl mx-auto"
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Pioneering the future of healthcare through intelligent innovation
            </motion.p>

            {/* CTA */}
            <motion.div
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <a href="#about" className="btn-primary">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#contact" className="btn-secondary">
                Contact Us
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="w-6 h-10 rounded-full border border-[#576574] flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-[#4fc3f7] rounded-full"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* About Section */}
        <section id="about" className="py-32 px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div
              className="text-center mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-light tracking-wider text-[#c8d6e5] mb-6">
                Redefining Health
              </h2>
              <p className="text-lg text-[#8395a7] max-w-2xl mx-auto leading-relaxed">
                At Antechamber Health, we believe in the power of technology to transform lives.
                Our mission is to make healthcare smarter, more accessible, and deeply personal.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.div
                className="glass-card p-8"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4fc3f7]/20 to-[#7c4dff]/20 flex items-center justify-center mb-6">
                  <HeartPulse className="w-7 h-7 text-[#4fc3f7]" />
                </div>
                <h3 className="text-xl font-medium text-[#c8d6e5] mb-3">Intelligent Care</h3>
                <p className="text-[#8395a7] leading-relaxed">
                  Advanced analytics that understand your unique health journey and provide
                  personalized insights.
                </p>
              </motion.div>

              <motion.div
                className="glass-card p-8"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7c4dff]/20 to-[#00e5ff]/20 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7 text-[#7c4dff]" />
                </div>
                <h3 className="text-xl font-medium text-[#c8d6e5] mb-3">Secure & Private</h3>
                <p className="text-[#8395a7] leading-relaxed">
                  Your data is yours. Enterprise-grade security ensures your health information
                  stays protected.
                </p>
              </motion.div>

              <motion.div
                className="glass-card p-8"
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00e5ff]/20 to-[#4fc3f7]/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-[#00e5ff]" />
                </div>
                <h3 className="text-xl font-medium text-[#c8d6e5] mb-3">Future Forward</h3>
                <p className="text-[#8395a7] leading-relaxed">
                  Cutting-edge technology that evolves with the latest advances in health science
                  and AI.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider" />

        {/* Contact Section */}
        <section id="contact" className="py-32 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-light tracking-wider text-[#c8d6e5] mb-6">
                Let&apos;s Connect
              </h2>
              <p className="text-lg text-[#8395a7] mb-12 max-w-xl mx-auto">
                Interested in learning more about Antechamber Health? We&apos;d love to hear from
                you.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <a href="mailto:isaacjwilkins@gmail.com" className="btn-primary">
                <Mail className="w-5 h-5" />
                Contact Us
              </a>
              <a
                href="https://linkedin.com/company/antechamber-health"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <LinkedinIcon className="w-5 h-5" />
                LinkedIn
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={32} />
            <span className="text-sm text-[#8395a7]">Antechamber Health</span>
          </div>
          <p className="text-sm text-[#576574]">
            &copy; 2026 Antechamber Health. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
