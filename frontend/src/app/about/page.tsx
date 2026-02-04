"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { fadeInUp, staggerContainer, getMotionProps } from "@/lib/motion";

const team = [
  {
    name: "Saim Hashmi",
    role: "Frontend, Design, Backend & Routing",
    linkedin: "https://www.linkedin.com/in/saim-hashmi-2230b6243",
  },
  {
    name: "Senura Dissanayake",
    role: "API Data Extraction",
    linkedin: "https://www.linkedin.com/in/senura-dissanayake-73113626a/",
  },
  {
    name: "Jad Moi El Din",
    role: "Graph Calculations",
    linkedin: "https://www.linkedin.com/in/jad-mohi-el-din-4411b7264/",
  },
  {
    name: "Arsh Jameel",
    role: "Frontend & Graph Building",
    linkedin: "https://www.linkedin.com/in/arshjameel/",
  },
];

export default function AboutPage() {
  const reducedMotion = useReducedMotion();
  const motionProps = getMotionProps(reducedMotion);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#070A12] via-[#0B1220] to-[#0B1220]">
      <MarketingNav />

      <main className="relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Hero */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            {...motionProps}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6"
            >
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFF] to-[#8B74FF]">
                Nightwatch
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed"
            >
              AI-powered pedestrian navigation that prioritizes well-lit streets
              over shortcuts, helping you walk home safely after dark.
            </motion.p>
          </motion.div>

          {/* What We Do */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            {...motionProps}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold text-white mb-6"
            >
              What Nightwatch Does
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="rounded-xl border border-[#7C5CFF]/40 bg-gradient-to-br from-[#14213A]/60 to-[#0B1220]/40 p-6 sm:p-8"
            >
              <p className="text-text-muted leading-relaxed mb-4">
                Nightwatch analyzes streetlight data from municipal sources to
                find pedestrian routes that maximize illumination coverage.
                Instead of simply finding the shortest path, we calculate routes
                that keep you on well-lit streets — even if it means walking a
                bit further.
              </p>
              <p className="text-text-muted leading-relaxed">
                Our system processes real streetlight locations and densities to
                build a safety-weighted routing graph, then uses graph
                algorithms to find optimal paths that balance distance with
                lighting quality.
              </p>
            </motion.div>
          </motion.section>

          {/* Algorithm Overview */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            {...motionProps}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold text-white mb-6"
            >
              How the Algorithm Works
            </motion.h2>
            <motion.div variants={fadeInUp} className="space-y-6">
              {/* Step 1 */}
              <div className="rounded-xl border border-[#7C5CFF]/40 bg-gradient-to-br from-[#14213A]/60 to-[#0B1220]/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7C5CFF]/30 flex items-center justify-center text-[#8B74FF] font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      Safety Score Calculation
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-3">
                      Each road segment gets a safety score based on nearby
                      streetlight density. More lights per 100 meters = higher
                      score.
                    </p>
                    <code className="block bg-[#0B1220]/80 text-[#8B74FF] text-xs sm:text-sm px-4 py-2 rounded-lg font-mono overflow-x-auto">
                      safety_score = lights_count / (segment_length / 100)
                    </code>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl border border-[#7C5CFF]/40 bg-gradient-to-br from-[#14213A]/60 to-[#0B1220]/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7C5CFF]/30 flex items-center justify-center text-[#8B74FF] font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      Edge Cost Weighting
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-3">
                      Road segments are weighted inversely to their safety.
                      Safer roads become &quot;cheaper&quot; to traverse,
                      encouraging the algorithm to prefer them.
                    </p>
                    <code className="block bg-[#0B1220]/80 text-[#8B74FF] text-xs sm:text-sm px-4 py-2 rounded-lg font-mono overflow-x-auto">
                      edge_cost = length / (1 + safety_score)
                    </code>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="rounded-xl border border-[#7C5CFF]/40 bg-gradient-to-br from-[#14213A]/60 to-[#0B1220]/40 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#7C5CFF]/30 flex items-center justify-center text-[#8B74FF] font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      Dijkstra&apos;s Algorithm
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      We use Dijkstra&apos;s shortest path algorithm on the
                      weighted graph. It finds the path with minimum total cost
                      — which, thanks to our weighting, naturally prefers
                      well-lit streets. This classic algorithm guarantees an
                      optimal solution efficiently.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Team */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            {...motionProps}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl font-bold text-white mb-6"
            >
              Team
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {team.map((member) => (
                <a
                  key={member.name}
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-[#7C5CFF]/40 bg-gradient-to-br from-[#14213A]/60 to-[#0B1220]/40 p-5
                            hover:border-[#7C5CFF]/70 hover:bg-[#14213A]/80 transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50"
                >
                  <h3 className="text-white font-semibold group-hover:text-[#8B74FF] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-text-muted text-sm mt-1">{member.role}</p>
                  <p className="text-[#8B74FF] text-xs mt-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      open_in_new
                    </span>
                    LinkedIn
                  </p>
                </a>
              ))}
            </motion.div>
          </motion.section>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            {...motionProps}
          >
            <Link href="/app">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#7C5CFF] via-[#8B74FF] to-[#4C7DFF]
                          text-white font-bold rounded-xl shadow-lg hover:shadow-xl
                          hover:shadow-[#7C5CFF]/40 transition-all duration-300"
              >
                Try the App
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
