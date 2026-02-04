"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { fadeInUp, staggerContainer, getMotionProps } from "@/lib/motion";
import { Meteors } from "@/components/ui/meteors";

export default function LandingPage() {
  const reducedMotion = useReducedMotion();
  const motionProps = getMotionProps(reducedMotion);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#070A12] via-[#0B1220] to-[#101A2D]">
      <MarketingNav />

      <Meteors overlay className="!bg-transparent pointer-events-none z-20" />
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-screen w-full overflow-hidden isolate pt-16">
          {/* Abstract City Background */}
          <div className="absolute inset-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#070A12] via-[#0B1220] to-[#101A2D]" />

            {/* City silhouette shapes */}
            <div className="absolute bottom-0 left-0 right-0 h-[60%]">
              {/* Building silhouettes */}
              <div className="absolute bottom-0 left-[5%] w-16 h-[45%] bg-[#0a1225] rounded-t-sm" />
              <div className="absolute bottom-0 left-[10%] w-24 h-[65%] bg-[#08101e] rounded-t-sm" />
              <div className="absolute bottom-0 left-[18%] w-12 h-[35%] bg-[#0b1428] rounded-t-sm" />
              <div className="absolute bottom-0 left-[25%] w-20 h-[55%] bg-[#07101c] rounded-t-sm" />
              <div className="absolute bottom-0 right-[30%] w-32 h-[70%] bg-[#091320] rounded-t-sm" />
              <div className="absolute bottom-0 right-[20%] w-16 h-[50%] bg-[#0a1224] rounded-t-sm" />
              <div className="absolute bottom-0 right-[10%] w-28 h-[60%] bg-[#08101d] rounded-t-sm" />
              <div className="absolute bottom-0 right-[5%] w-14 h-[40%] bg-[#0b1529] rounded-t-sm" />

              {/* Window lights */}
              <div className="absolute bottom-[20%] left-[11%] w-1 h-1 bg-primary/40 rounded-full" />
              <div className="absolute bottom-[35%] left-[12%] w-1 h-1 bg-secondary/30 rounded-full" />
              <div className="absolute bottom-[25%] right-[32%] w-1 h-1 bg-primary/30 rounded-full" />
              <div className="absolute bottom-[45%] right-[33%] w-1 h-1 bg-white/20 rounded-full" />
              <div className="absolute bottom-[30%] right-[12%] w-1 h-1 bg-secondary/30 rounded-full" />
              <div className="absolute bottom-[15%] right-[22%] w-1 h-1 bg-primary/30 rounded-full" />
            </div>

            {/* Ambient glows */}
            <div className="absolute top-[20%] right-[20%] w-[500px] h-[300px] bg-primary/3 rounded-full blur-3xl" />
            <div className="absolute top-[40%] left-[10%] w-[400px] h-[250px] bg-secondary/3 rounded-full blur-3xl" />
            <div className="absolute bottom-[30%] right-[30%] w-[300px] h-[200px] bg-primary/5 rounded-full blur-2xl" />

            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end pt-20 sm:pt-16">
            <motion.div
              className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-16 sm:pb-20 lg:pb-32"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              {...motionProps}
            >
              <div className="max-w-4xl space-y-8">
                {/* Headline */}
                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-white drop-shadow-2xl"
                >
                  Walk with <br />
                  <span
                    className="inline-block"
                    style={{
                      background: "linear-gradient(90deg, rgba(124,92,255,0.95) 0%, rgba(76,125,255,0.95) 60%, rgba(255,255,255,0.92) 120%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    confidence
                  </span>{" "}
                  <br />
                  after dark.
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-gray-200 max-w-2xl leading-relaxed font-medium drop-shadow-md"
                >
                  AI-driven navigation that prioritizes well-lit streets over
                  shortcuts. Let{" "}
                  <span className="text-primary font-bold">Nightwatch</span>{" "}
                  guide your way home safely.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-wrap gap-4 pt-4"
                >
                  <Link href="/app">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#7C5CFF] to-[#4C7DFF]
                                text-white font-bold rounded-xl shadow-premium hover:shadow-lg
                                transition-all duration-300
                                hover:-translate-y-0.5"
                    >
                      Try Live Demo
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="border-primary/40 bg-[#14213A]/50 backdrop-blur-md text-white
                                hover:bg-[#14213A]/80 hover:border-primary/60 rounded-xl
                                transition-all duration-200"
                      rightIcon={
                        <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      }
                    >
                      How it Works
                    </Button>
                  </a>
                </motion.div>

                {/* Social Proof */}
                <motion.div
                  variants={fadeInUp}
                  className="flex items-center gap-4 mt-8 text-sm text-gray-300"
                >
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        src={`/images/avatar-${i}.svg`}
                        alt={`User ${i}`}
                        className="w-10 h-10 rounded-full border-2 border-background-dark"
                      />
                    ))}
                  </div>
                  <p className="font-medium">Trusted by 3+ people ( Us )</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <motion.section
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 space-y-16 sm:space-y-24 lg:space-y-32"
          id="how-it-works"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          {...motionProps}
        >
          <motion.div
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto space-y-4 mb-24"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Illuminating the unseen
            </h2>
            <p className="text-text-muted text-xl">
              Our AI analyzes multiple layers of city data to ensure your
              journey is as safe as it is efficient.
            </p>
          </motion.div>

          {/* Feature 1: Smart Routing */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-center gap-16 lg:gap-24"
          >
            <div className="flex-1 w-full order-2 md:order-1">
              <div
                className="relative group aspect-[4/3] rounded-2xl overflow-hidden
                             border border-white/[0.08] shadow-premium bg-[#14213A]/50
                             hover:border-white/[0.12] transition-all duration-300"
              >
                <img
                  src="/images/map-card-1.png"
                  alt="Smart routing"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 to-transparent" />
                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-primary/10 backdrop-blur-md
                                 border border-primary/20 flex items-center justify-center
                                 text-primary shadow-premium"
                  >
                    <span className="material-symbols-outlined text-4xl">
                      location_on
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-6 order-1 md:order-2">
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Smart Routing
              </h3>
              <p className="text-xl text-text-muted leading-relaxed">
                Analyzes municipal street light data and real-time foot traffic
                to find the most illuminated paths.
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-[#7C5CFF] to-[#4C7DFF] rounded-full" />
            </div>
          </motion.div>

          {/* Feature 2: Safety vs Speed */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row items-center gap-16 lg:gap-24"
          >
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Safety vs Speed
              </h3>
              <p className="text-xl text-text-muted leading-relaxed">
                Customize your preference. Choose the brightest path, not just
                the fastest one available.
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-secondary/50 to-secondary/20 rounded-full" />
            </div>
            <div className="flex-1 w-full">
              <div
                className="relative group aspect-[4/3] rounded-2xl overflow-hidden
                             border border-white/[0.08] shadow-premium bg-[#14213A]/50
                             hover:border-white/[0.12] transition-all duration-300"
              >
                <img
                  src="/images/map-card-2.png"
                  alt="Safety preferences"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 to-transparent" />
                <div className="absolute bottom-8 right-8 flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-secondary/10 backdrop-blur-md
                                 border border-secondary/20 flex items-center justify-center
                                 text-secondary shadow-premium"
                  >
                    <span className="material-symbols-outlined text-4xl">
                      balance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* App Preview Section */}
        <section
          className="w-full bg-gradient-to-b from-[#101A2D]/50 to-[#070A12]/50
                     border-y border-white/[0.08] py-32 relative overflow-hidden"
          id="app"
        >
          <div
            className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(124, 92, 255, 0.06) 0%, transparent 50%)",
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-10 sm:gap-16 lg:gap-24">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                See the <span className="text-primary text-glow">light</span>.
                <br />
                Avoid the shadows.
              </h2>
              <p className="text-xl text-text-muted max-w-md leading-relaxed">
                Experience the difference. While standard maps send you through
                dark alleys to save 30 seconds, Nightwatch finds the path where
                you can walk with your head up.
              </p>
              <div className="flex flex-col gap-6 pt-4">
                {/* Safest Route Card */}
                <div
                  className="flex items-center gap-4 p-6 rounded-xl bg-[#14213A]/60
                               border border-primary/20 shadow-premium
                               hover:border-primary/30 transition-all duration-200"
                >
                  <div
                    className="w-2 h-12 rounded-full bg-gradient-to-b from-[#7C5CFF] to-[#4C7DFF]"
                  />
                  <div>
                    <h4 className="text-white text-lg font-bold">
                      Safest Route
                    </h4>
                    <p className="text-sm text-text-muted">
                      Well-lit main avenues · 12 mins
                    </p>
                  </div>
                </div>
                {/* Shortest Route Card */}
                <div className="flex items-center gap-4 p-6 rounded-xl border border-white/[0.06] opacity-50">
                  <div className="w-2 h-12 rounded-full bg-gray-600" />
                  <div>
                    <h4 className="text-white text-lg font-bold">
                      Shortest Route
                    </h4>
                    <p className="text-sm text-text-muted">
                      Unlit shortcuts · 9 mins
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div
                className="relative rounded-2xl overflow-hidden border border-white/[0.08]
                             shadow-premium bg-[#0B1220] aspect-[4/3]"
              >
                {/* Map Preview */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#14213A]/60 to-[#0B1220]/80 opacity-60" />
                <svg
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 400 300"
                >
                  <path
                    d="M50 250 C 100 250, 150 200, 200 150 S 300 100, 350 50"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeLinecap="round"
                    strokeWidth="6"
                    className="route-draw"
                  />
                  <defs>
                    <linearGradient
                      id="routeGradient"
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#7C5CFF" />
                      <stop offset="100%" stopColor="#4C7DFF" />
                    </linearGradient>
                  </defs>
                  <circle cx="350" cy="50" fill="#8B74FF" r="8" />
                  <circle cx="50" cy="250" fill="white" r="8" />
                </svg>
                <div
                  className="absolute bottom-8 left-8 right-8 p-6 bg-[#0B1220]/95 backdrop-blur-xl
                               border border-white/[0.08] rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-2xl font-bold">
                        directions_walk
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-base font-bold">
                        Navigating to Home
                      </p>
                      <p className="text-sm text-primary">
                        Via Main St (Lit)
                      </p>
                    </div>
                  </div>
                  <span className="text-white text-lg font-bold">12 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
          <div
            className="max-w-5xl mx-auto rounded-2xl relative overflow-hidden p-8 sm:p-12 md:p-16 lg:p-24 text-center
                         border border-white/[0.08] bg-gradient-to-b from-[#14213A]/50 to-[#0B1220]/80
                         shadow-premium"
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
                           bg-gradient-radial from-primary/8 to-transparent opacity-50"
            />
            <div className="relative z-10 flex flex-col items-center gap-10">
              <span className="material-symbols-outlined text-7xl text-secondary">
                lightbulb
              </span>
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white">
                  Ready to light your path?
                </h2>
                <p className="text-text-muted max-w-lg mx-auto text-xl">
                  Join our users who are reclaiming the night. Try Nightwatch
                  today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full justify-center">
                <Link href="/app">
                  <Button
                    size="lg"
                    className="h-16 px-10 text-xl bg-gradient-to-r from-[#7C5CFF] to-[#4C7DFF]
                              text-white font-bold rounded-xl shadow-premium hover:shadow-lg
                              transition-all duration-300"
                    leftIcon={
                      <span className="material-symbols-outlined text-2xl">
                        explore
                      </span>
                    }
                  >
                    Try the App
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
