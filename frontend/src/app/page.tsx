import Link from "next/link";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui";
import { SnowBackground } from "@/components/ui/snow";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#050A14] via-[#0F2326] to-[#0B1221]">
      <MarketingNav />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative h-screen w-full overflow-hidden isolate">
          {/* Background Scene (everything behind snow) */}
          <div className="absolute inset-0 z-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#050A14] via-[#0F2326] to-[#0B1221]" />

            {/* Ambient glows */}
            <div className="absolute top-[20%] right-[20%] w-[500px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-[40%] left-[10%] w-[400px] h-[250px] bg-noor-gold/3 rounded-full blur-3xl" />
            <div className="absolute bottom-[30%] right-[30%] w-[300px] h-[200px] bg-primary/8 rounded-full blur-2xl" />

            {/* City silhouette shapes */}
            <div className="absolute bottom-0 left-0 right-0 h-[60%] z-10">
              {/* Building silhouettes */}
              <div className="absolute bottom-0 left-[5%] w-16 h-[45%] bg-[#0c1a2a] rounded-t-sm" />
              <div className="absolute bottom-0 left-[10%] w-24 h-[65%] bg-[#0a1525] rounded-t-sm" />
              <div className="absolute bottom-0 left-[18%] w-12 h-[35%] bg-[#0d1c2d] rounded-t-sm" />
              <div className="absolute bottom-0 left-[25%] w-20 h-[55%] bg-[#091320] rounded-t-sm" />
              <div className="absolute bottom-0 right-[30%] w-32 h-[70%] bg-[#0b1826] rounded-t-sm" />
              <div className="absolute bottom-0 right-[20%] w-16 h-[50%] bg-[#0c1a29] rounded-t-sm" />
              <div className="absolute bottom-0 right-[10%] w-28 h-[60%] bg-[#0a1422] rounded-t-sm" />
              <div className="absolute bottom-0 right-[5%] w-14 h-[40%] bg-[#0d1d2f] rounded-t-sm" />

              {/* Window lights */}
              <div className="absolute bottom-[20%] left-[11%] w-1 h-1 bg-primary/60 rounded-full shadow-[0_0_6px_#13c8ec]" />
              <div className="absolute bottom-[35%] left-[12%] w-1 h-1 bg-noor-gold/50 rounded-full shadow-[0_0_4px_#fffacd]" />
              <div className="absolute bottom-[25%] right-[32%] w-1 h-1 bg-primary/40 rounded-full shadow-[0_0_6px_#13c8ec]" />
              <div className="absolute bottom-[45%] right-[33%] w-1 h-1 bg-white/30 rounded-full" />
              <div className="absolute bottom-[30%] right-[12%] w-1 h-1 bg-noor-gold/40 rounded-full shadow-[0_0_4px_#fffacd]" />
              <div className="absolute bottom-[15%] right-[22%] w-1 h-1 bg-primary/50 rounded-full shadow-[0_0_6px_#13c8ec]" />
            </div>

            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
          </div>

          {/* Snow Overlay (in front of background scene, behind content) */}
          <SnowBackground className="absolute inset-0 z-20 pointer-events-none" />

          {/* Hero Content (in front of snow) */}
          <div className="absolute inset-0 z-30 flex flex-col justify-end">
            <div className="max-w-7xl mx-auto px-6 w-full pb-20 lg:pb-32">
              <div className="max-w-4xl space-y-8">
                {/* Headline */}
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight text-white drop-shadow-2xl">
                  Walk with <br />
                  <span
                    className="inline-block"
                    style={{
                      background: "linear-gradient(to right, #13c8ec, #fffacd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    confidence
                  </span>{" "}
                  <br />
                  after dark.
                </h1>

                {/* Subheadline */}
                <p className="text-xl text-gray-200 max-w-2xl leading-relaxed font-medium drop-shadow-md">
                  AI-driven navigation that prioritizes well-lit streets over
                  shortcuts. Let{" "}
                  <span className="text-primary font-bold">Nightwatch</span>{" "}
                  guide your way home safely.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/app">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-[#0F7A82] via-[#37B8A6] to-[#1AC6E6]
                                text-black font-bold rounded-xl shadow-lg hover:shadow-xl
                                hover:shadow-[#0F7A82]/40 transition-all duration-300
                                hover:-translate-y-0.5"
                    >
                      Try Live Demo
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="border-[#0F7A82]/50 bg-[#1A363B]/50 backdrop-blur-md text-white
                                hover:bg-[#1A363B]/80 hover:border-[#0F7A82]/80 rounded-xl
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
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-4 mt-8 text-sm text-gray-300">
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
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className="w-full max-w-7xl mx-auto px-6 py-32 space-y-32"
          id="how-it-works"
        >
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Illuminating the unseen
            </h2>
            <p className="text-gray-400 text-xl">
              Our AI analyzes multiple layers of city data to ensure your
              journey is as safe as it is efficient.
            </p>
          </div>

          {/* Feature 1: Smart Routing */}
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 w-full order-2 md:order-1">
              <div
                className="relative group aspect-[4/3] rounded-2xl overflow-hidden
                             border border-[#0F7A82]/40 shadow-2xl bg-[#1A363B]/50
                             hover:border-[#0F7A82]/60 transition-all duration-300"
              >
                <img
                  src="/images/map-card-1.png"
                  alt="Smart routing"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2326]/90 to-transparent" />
                <div className="absolute bottom-8 left-8 flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-[#0F7A82]/20 backdrop-blur-md
                                 border border-[#0F7A82]/40 flex items-center justify-center
                                 text-[#37B8A6] shadow-lg shadow-[#0F7A82]/20"
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
              <div className="w-20 h-1 bg-gradient-to-r from-[#0F7A82] to-[#37B8A6] rounded-full" />
            </div>
          </div>

          {/* Feature 2: Safety vs Speed */}
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Safety vs Speed
              </h3>
              <p className="text-xl text-text-muted leading-relaxed">
                Customize your preference. Choose the brightest path, not just
                the fastest one available.
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-noor-gold/50 to-noor-gold/20 rounded-full" />
            </div>
            <div className="flex-1 w-full">
              <div
                className="relative group aspect-[4/3] rounded-2xl overflow-hidden
                             border border-[#0F7A82]/40 shadow-2xl bg-[#1A363B]/50
                             hover:border-[#0F7A82]/60 transition-all duration-300"
              >
                <img
                  src="/images/map-card-2.png"
                  alt="Safety preferences"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2326]/90 to-transparent" />
                <div className="absolute bottom-8 right-8 flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-noor-gold/15 backdrop-blur-md
                                 border border-noor-gold/30 flex items-center justify-center
                                 text-noor-gold shadow-lg shadow-noor-gold/15"
                  >
                    <span className="material-symbols-outlined text-4xl">
                      balance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Community Verified */}
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 w-full order-2 md:order-1">
              <div
                className="relative group aspect-[4/3] rounded-2xl overflow-hidden
                             border border-[#0F7A82]/40 shadow-2xl bg-[#1A363B]/50
                             hover:border-[#0F7A82]/60 transition-all duration-300"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="bg-[#1A363B]/90 backdrop-blur-xl p-6 rounded-xl
                                 border border-[#0F7A82]/40 shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#0F7A82]/20 flex items-center justify-center text-[#37B8A6]">
                        <span className="material-symbols-outlined">shield</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Community Alert</p>
                        <p className="text-xs text-[#37B8A6]">
                          Street light out on 5th Ave
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8">
                  <div
                    className="w-16 h-16 rounded-xl bg-[#0F7A82]/20 backdrop-blur-md
                                 border border-[#0F7A82]/40 flex items-center justify-center
                                 text-[#37B8A6] shadow-lg shadow-[#0F7A82]/20"
                  >
                    <span className="material-symbols-outlined text-4xl">
                      verified_user
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-6 order-1 md:order-2">
              <h3 className="text-3xl md:text-4xl font-bold text-white">
                Community Verified
              </h3>
              <p className="text-xl text-text-muted leading-relaxed">
                Real-time updates on broken lights and safety incidents from
                verified community reports.
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-[#0F7A82] to-[#37B8A6] rounded-full" />
            </div>
          </div>
        </section>

        {/* App Preview Section */}
        <section
          className="w-full bg-gradient-to-b from-[#0F2326]/50 to-[#050A14]/50
                     border-y border-[#0F7A82]/20 py-32 relative overflow-hidden"
          id="app"
        >
          <div
            className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(15, 122, 130, 0.08) 0%, transparent 50%)",
            }}
          />
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                See the <span className="text-[#37B8A6] text-glow">light</span>.
                <br />
                Avoid the shadows.
              </h2>
              <p className="text-xl text-text-muted max-w-md leading-relaxed">
                Experience the difference. While standard maps send you through
                dark alleys to save 30 seconds, Nightwatch finds the path where
                you can walk with your head up.
              </p>
              <div className="flex flex-col gap-6 pt-4">
                <div
                  className="flex items-center gap-4 p-6 rounded-xl bg-[#1A363B]/80
                               border border-[#0F7A82]/50 shadow-lg shadow-[#0F7A82]/10
                               hover:border-[#0F7A82]/70 transition-all duration-200"
                >
                  <div
                    className="w-2 h-12 rounded-full bg-gradient-to-b from-[#0F7A82] to-[#37B8A6]
                                 shadow-[0_0_15px_rgba(15,122,130,0.6)]"
                  />
                  <div>
                    <h4 className="text-white text-lg font-bold">Safest Route</h4>
                    <p className="text-sm text-text-muted">
                      Well-lit main avenues • 12 mins
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 rounded-xl border border-[#0F7A82]/20 opacity-50">
                  <div className="w-2 h-12 rounded-full bg-gray-600" />
                  <div>
                    <h4 className="text-white text-lg font-bold">Shortest Route</h4>
                    <p className="text-sm text-text-muted">
                      Unlit shortcuts • 9 mins
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div
                className="relative rounded-2xl overflow-hidden border border-[#0F7A82]/40
                             shadow-2xl shadow-[#0F7A82]/10 bg-[#0F2326] aspect-[4/3]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1A363B]/60 to-[#0F2326]/80 opacity-60" />
                <svg
                  className="absolute inset-0 w-full h-full drop-shadow-[0_0_12px_rgba(15,122,130,0.8)]"
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
                    <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0F7A82" />
                      <stop offset="100%" stopColor="#37B8A6" />
                    </linearGradient>
                  </defs>
                  <circle cx="350" cy="50" fill="#37B8A6" r="8" />
                  <circle cx="50" cy="250" fill="white" r="8" />
                </svg>
                <div
                  className="absolute bottom-8 left-8 right-8 p-6 bg-[#0F2326]/95 backdrop-blur-xl
                               border border-[#0F7A82]/40 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[#0F7A82]/20 text-[#37B8A6]">
                      <span className="material-symbols-outlined text-2xl font-bold">
                        directions_walk
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-base font-bold">Navigating to Home</p>
                      <p className="text-sm text-[#37B8A6]">Via Main St (Lit)</p>
                    </div>
                  </div>
                  <span className="text-white text-lg font-bold">12 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-32 px-6">
          <div
            className="max-w-5xl mx-auto rounded-2xl relative overflow-hidden p-16 lg:p-24 text-center
                         border border-[#0F7A82]/40 bg-gradient-to-b from-[#1A363B]/50 to-[#0F2326]/80
                         shadow-2xl shadow-[#0F7A82]/10"
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full
                           bg-gradient-radial from-[#0F7A82]/15 to-transparent opacity-50"
            />
            <div className="relative z-10 flex flex-col items-center gap-10">
              <span className="material-symbols-outlined text-7xl text-noor-gold">
                lightbulb
              </span>
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-white">
                  Ready to light your path?
                </h2>
                <p className="text-text-muted max-w-lg mx-auto text-xl">
                  Join thousands of users who are reclaiming the night. Try
                  Nightwatch today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 mt-4 w-full justify-center">
                <Link href="/app">
                  <Button
                    size="lg"
                    className="h-16 px-10 text-xl bg-gradient-to-r from-[#0F7A82] via-[#37B8A6] to-[#1AC6E6]
                              text-black font-bold rounded-xl shadow-lg hover:shadow-xl
                              hover:shadow-[#0F7A82]/40 transition-all duration-300"
                    leftIcon={<span className="material-symbols-outlined text-2xl">explore</span>}
                  >
                    Try the App
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-16 px-10 text-xl bg-[#1A363B]/50 border border-[#0F7A82]/50
                            hover:bg-[#1A363B]/80 hover:border-[#0F7A82]/80 rounded-xl
                            transition-all duration-200"
                  leftIcon={<span className="material-symbols-outlined text-2xl">play_apps</span>}
                >
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
