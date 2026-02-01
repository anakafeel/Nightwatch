import Link from "next/link";
import { Button, Badge, Input, Toggle, Card } from "@/components/ui";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function DesignSystemPage() {
  return (
    <div className="bg-background-dark font-display text-white antialiased overflow-x-hidden min-h-screen">
      {/* Top Navigation */}
      <div className="flex justify-center w-full border-b border-border-dark bg-background-dark/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex w-full max-w-[1440px] items-center justify-between px-6 py-4 lg:px-10">
          <BrandLogo variant="lockup" size={32} href="/" />
          <Link href="/">
            <Button
              leftIcon={<span className="material-symbols-outlined text-[18px]">arrow_back</span>}
            >
              Back to App
            </Button>
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 justify-center py-10 px-6 lg:px-10">
        <div className="flex flex-col w-full max-w-[1080px] flex-1 gap-12">
          {/* Page Heading */}
          <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
            <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em]">
              Nightwatch <span className="text-primary font-light">DS v1.0</span>
            </h1>
            <p className="text-text-muted text-lg font-normal leading-normal max-w-2xl">
              A comprehensive guide to the visual language of the Nightwatch interface.
              Built for high-contrast, data-heavy environments with a futuristic aesthetic.
            </p>
          </div>

          {/* Color Palette Section */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">palette</span>
              <h2 className="text-white text-2xl font-bold tracking-tight">Color Palette</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Midnight */}
              <div className="flex flex-col gap-3">
                <div className="h-32 w-full rounded-xl bg-background-dark border border-white/10 shadow-lg" />
                <div className="flex flex-col px-1">
                  <span className="text-white font-bold">Midnight</span>
                  <span className="text-text-muted text-sm font-mono">#050A14</span>
                  <span className="text-text-muted text-xs mt-1">Background / Surface</span>
                </div>
              </div>
              {/* Owl Cyan */}
              <div className="flex flex-col gap-3">
                <div className="h-32 w-full rounded-xl bg-primary shadow-glow-primary" />
                <div className="flex flex-col px-1">
                  <span className="text-white font-bold">Owl Cyan</span>
                  <span className="text-text-muted text-sm font-mono">#13c8ec</span>
                  <span className="text-text-muted text-xs mt-1">Primary / Action</span>
                </div>
              </div>
              {/* Owl Gold */}
              <div className="flex flex-col gap-3">
                <div className="h-32 w-full rounded-xl bg-noor-gold shadow-glow-warning" />
                <div className="flex flex-col px-1">
                  <span className="text-white font-bold">Owl Gold</span>
                  <span className="text-text-muted text-sm font-mono">#FFFACD</span>
                  <span className="text-text-muted text-xs mt-1">Accent / Highlight</span>
                </div>
              </div>
              {/* Glass */}
              <div className="flex flex-col gap-3">
                <div className="h-32 w-full rounded-xl glass-panel flex items-center justify-center">
                  <span className="text-white/50 text-sm">Translucent</span>
                </div>
                <div className="flex flex-col px-1">
                  <span className="text-white font-bold">Glass</span>
                  <span className="text-text-muted text-sm font-mono">rgba(255,255,255,0.05)</span>
                  <span className="text-text-muted text-xs mt-1">Overlays / Cards</span>
                </div>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">text_fields</span>
              <h2 className="text-white text-2xl font-bold tracking-tight">Typography</h2>
            </div>
            <div className="flex flex-col gap-8 p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 border-b border-white/5 pb-6">
                <div className="w-48 shrink-0 text-text-muted font-mono text-sm">
                  <span className="block text-primary">Header 1</span>
                  Inter Black / 48px
                </div>
                <h1 className="text-5xl font-black text-white">
                  The quick brown fox jumps over the lazy dog.
                </h1>
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 border-b border-white/5 pb-6">
                <div className="w-48 shrink-0 text-text-muted font-mono text-sm">
                  <span className="block text-primary">Header 2</span>
                  Inter Bold / 32px
                </div>
                <h2 className="text-3xl font-bold text-white">
                  The quick brown fox jumps over the lazy dog.
                </h2>
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 border-b border-white/5 pb-6">
                <div className="w-48 shrink-0 text-text-muted font-mono text-sm">
                  <span className="block text-primary">Body</span>
                  Inter Regular / 16px
                </div>
                <p className="text-base font-normal text-gray-300 max-w-2xl">
                  Design is not just what it looks like and feels like. Design is how it works.
                  Good design is obvious. Great design is transparent.
                </p>
              </div>
            </div>
          </section>

          {/* Components Section */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">smart_button</span>
              <h2 className="text-white text-2xl font-bold tracking-tight">Components</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Buttons */}
              <Card variant="glass" className="p-6">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">
                  Buttons
                </h3>
                <div className="flex flex-col gap-4 items-start">
                  <Button>Primary Action</Button>
                  <Button variant="secondary">Secondary Action</Button>
                  <Button variant="ghost">Tertiary Action</Button>
                </div>
              </Card>

              {/* Form Elements */}
              <Card variant="glass" className="p-6 lg:col-span-2">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">
                  Form Elements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input
                    label="Search"
                    placeholder="Search keywords..."
                    leftIcon={<span className="material-symbols-outlined">search</span>}
                  />
                  <div className="flex flex-col gap-4">
                    <label className="text-xs font-medium text-text-muted">Preferences</label>
                    <div className="flex items-center gap-8">
                      <Toggle label="Notifications" defaultChecked />
                      <Toggle label="Auto-save" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Status Badges */}
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">verified</span>
              <h2 className="text-white text-2xl font-bold tracking-tight">Status Badges</h2>
            </div>
            <div className="flex flex-wrap gap-4 p-8 rounded-2xl border border-white/5 bg-white/[0.02] items-center">
              <Badge variant="coverage" coverage="high" pulse>
                High Coverage
              </Badge>
              <Badge variant="coverage" coverage="medium">
                Medium
              </Badge>
              <Badge variant="coverage" coverage="low">
                Low
              </Badge>
              <Badge variant="info">
                <span className="material-symbols-outlined text-[14px]">info</span>
                System Info
              </Badge>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border-dark py-8 text-center text-text-muted text-sm">
            <p>&copy; 2024 Nightwatch Design System. Internal Use Only.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
