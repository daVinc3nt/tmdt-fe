import { MascotIcon } from "./MascotIcon";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ArrowLeft, Check, Copy } from "lucide-react";
import { useState } from "react";

interface DesktopUIKitProps {
  onBack: () => void;
}

const brandColors = [
  { name: "Primary Orange", value: "#FF7A00", var: "--primary", usage: "Primary actions, CTAs, highlights" },
  { name: "White", value: "#FFFFFF", var: "--background", usage: "Background, card fills" },
  { name: "Light Gray", value: "#F2F2F2", var: "--muted", usage: "Subtle backgrounds, disabled states" },
  { name: "Neutral Gray", value: "#4A4A4A", var: "--muted-foreground", usage: "Secondary text, icons" },
  { name: "Soft Black", value: "#1A1A1A", var: "--foreground", usage: "Primary text, headings" },
];

const typography = [
  { family: "Inter", usage: "UI elements, body text, paragraphs", weights: ["400", "500", "600"] },
  { family: "Montserrat", usage: "Headers, titles, hero sections", weights: ["600", "700", "800"] },
  { family: "Poppins", usage: "Buttons, badges, numbers, stats", weights: ["500", "600", "700"] },
];

export function DesktopUIKit({ onBack }: DesktopUIKitProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={onBack} variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="text-center">
              <h1 className="text-foreground">FitConnect UI Kit</h1>
              <p className="text-muted-foreground text-sm">Brand Identity & Design System</p>
            </div>

            <div className="w-[120px]"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Brand Mascot Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-foreground mb-2">Brand Mascot</h2>
            <p className="text-muted-foreground">Tiger mascot in flat minimalistic style representing strength and energy</p>
          </div>

          <Card className="p-8 border-border bg-card">
            <div className="grid grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-muted rounded-[20px] p-8 mb-4 flex items-center justify-center">
                  <MascotIcon className="w-16 h-16" />
                </div>
                <p className="text-sm text-muted-foreground">Small (64px)</p>
                <p className="text-xs text-muted-foreground">Navigation, Icons</p>
              </div>

              <div className="text-center">
                <div className="bg-muted rounded-[20px] p-8 mb-4 flex items-center justify-center">
                  <MascotIcon className="w-24 h-24" />
                </div>
                <p className="text-sm text-muted-foreground">Medium (96px)</p>
                <p className="text-xs text-muted-foreground">Headers, Cards</p>
              </div>

              <div className="text-center">
                <div className="bg-muted rounded-[20px] p-8 mb-4 flex items-center justify-center">
                  <MascotIcon className="w-32 h-32" />
                </div>
                <p className="text-sm text-muted-foreground">Large (128px)</p>
                <p className="text-xs text-muted-foreground">Hero Sections</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-[20px] p-8 mb-4 flex items-center justify-center">
                  <MascotIcon className="w-32 h-32" />
                </div>
                <p className="text-sm text-muted-foreground">With Background</p>
                <p className="text-xs text-muted-foreground">Featured Placement</p>
              </div>
            </div>
          </Card>
        </section>

        {/* Color Palette Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-foreground mb-2">Color Palette</h2>
            <p className="text-muted-foreground">Primary brand colors and their usage guidelines</p>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {brandColors.map((color) => (
              <Card key={color.name} className="overflow-hidden border-border bg-card">
                <div 
                  className="h-40 relative group cursor-pointer"
                  style={{ backgroundColor: color.value }}
                  onClick={() => copyToClipboard(color.value)}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    {copiedColor === color.value ? (
                      <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <Copy className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-foreground text-sm mb-1">{color.name}</h3>
                  <p className="text-muted-foreground text-xs mb-2 font-mono">{color.value}</p>
                  <p className="text-muted-foreground text-xs">CSS: {color.var}</p>
                  <p className="text-muted-foreground text-xs mt-2">{color.usage}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-foreground mb-2">Typography System</h2>
            <p className="text-muted-foreground">Font families and their designated usage across the platform</p>
          </div>

          <div className="space-y-6">
            {typography.map((font) => (
              <Card key={font.family} className="p-6 border-border bg-card">
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-foreground mb-2" style={{ fontFamily: font.family }}>{font.family}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{font.usage}</p>
                    <div className="flex gap-2">
                      {font.weights.map((weight) => (
                        <Badge key={weight} variant="outline" className="border-border">
                          {weight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 space-y-3">
                    <div style={{ fontFamily: font.family, fontWeight: 800 }} className="text-4xl text-foreground">
                      The Quick Brown Fox
                    </div>
                    <div style={{ fontFamily: font.family, fontWeight: 600 }} className="text-2xl text-foreground">
                      The Quick Brown Fox Jumps Over
                    </div>
                    <div style={{ fontFamily: font.family, fontWeight: 400 }} className="text-base text-muted-foreground">
                      The quick brown fox jumps over the lazy dog. 0123456789
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Component Styles Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-foreground mb-2">Component Styles</h2>
            <p className="text-muted-foreground">Reusable UI components with consistent styling</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Buttons */}
            <Card className="p-6 border-border bg-card">
              <h3 className="text-foreground mb-4">Buttons</h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <Button className="bg-primary text-white">Primary Button</Button>
                  <code className="text-xs text-muted-foreground">bg-primary text-white</code>
                </div>
                <div className="flex gap-3 items-center">
                  <Button variant="outline">Outline Button</Button>
                  <code className="text-xs text-muted-foreground">variant="outline"</code>
                </div>
                <div className="flex gap-3 items-center">
                  <Button variant="ghost">Ghost Button</Button>
                  <code className="text-xs text-muted-foreground">variant="ghost"</code>
                </div>
                <div className="flex gap-3 items-center">
                  <Button size="sm" className="bg-primary text-white">Small Button</Button>
                  <code className="text-xs text-muted-foreground">size="sm"</code>
                </div>
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-6 border-border bg-card">
              <h3 className="text-foreground mb-4">Badges</h3>
              <div className="space-y-3">
                <div className="flex gap-3 items-center">
                  <Badge className="bg-primary text-white border-0">Primary Badge</Badge>
                  <code className="text-xs text-muted-foreground">bg-primary text-white</code>
                </div>
                <div className="flex gap-3 items-center">
                  <Badge variant="outline">Outline Badge</Badge>
                  <code className="text-xs text-muted-foreground">variant="outline"</code>
                </div>
                <div className="flex gap-3 items-center">
                  <Badge className="bg-destructive text-white border-0">Alert Badge</Badge>
                  <code className="text-xs text-muted-foreground">bg-destructive</code>
                </div>
                <div className="flex gap-3 items-center">
                  <Badge className="bg-green-500 text-white border-0">Success Badge</Badge>
                  <code className="text-xs text-muted-foreground">bg-green-500</code>
                </div>
              </div>
            </Card>

            {/* Cards */}
            <Card className="p-6 border-border bg-card">
              <h3 className="text-foreground mb-4">Cards</h3>
              <div className="space-y-3">
                <Card className="p-4 border-border bg-card">
                  <p className="text-sm text-foreground">Default Card</p>
                  <code className="text-xs text-muted-foreground block mt-2">border-radius: 20px</code>
                </Card>
                <Card className="p-4 border-primary bg-primary/5 border-2">
                  <p className="text-sm text-foreground">Highlighted Card</p>
                  <code className="text-xs text-muted-foreground block mt-2">border-primary border-2</code>
                </Card>
                <Card className="p-4 border-border bg-card hover:shadow-lg transition-shadow cursor-pointer">
                  <p className="text-sm text-foreground">Interactive Card</p>
                  <code className="text-xs text-muted-foreground block mt-2">hover:shadow-lg</code>
                </Card>
              </div>
            </Card>

            {/* Inputs */}
            <Card className="p-6 border-border bg-card">
              <h3 className="text-foreground mb-4">Form Inputs</h3>
              <div className="space-y-3">
                <div>
                  <Input placeholder="Default Input" className="bg-background border-border" />
                  <code className="text-xs text-muted-foreground block mt-1">bg-background border-border</code>
                </div>
                <div>
                  <Input placeholder="Focused Input" className="bg-background border-primary" />
                  <code className="text-xs text-muted-foreground block mt-1">border-primary (focus state)</code>
                </div>
                <div>
                  <Input placeholder="Disabled Input" disabled className="bg-muted" />
                  <code className="text-xs text-muted-foreground block mt-1">disabled bg-muted</code>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Design Guidelines */}
        <section>
          <div className="mb-6">
            <h2 className="text-foreground mb-2">Design Guidelines</h2>
            <p className="text-muted-foreground">Core principles for maintaining visual consistency</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Card className="p-6 border-border bg-card">
              <div className="w-12 h-12 bg-primary rounded-full mb-4 flex items-center justify-center text-white">
                1
              </div>
              <h3 className="text-foreground mb-2">Border Radius</h3>
              <p className="text-muted-foreground text-sm mb-3">All cards and containers use 20px border radius for a modern, soft appearance</p>
              <code className="text-xs text-primary">border-radius: 20px</code>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="w-12 h-12 bg-primary rounded-full mb-4 flex items-center justify-center text-white">
                2
              </div>
              <h3 className="text-foreground mb-2">Shadows</h3>
              <p className="text-muted-foreground text-sm mb-3">Subtle shadows on hover states create depth without overwhelming the design</p>
              <code className="text-xs text-primary">hover:shadow-lg</code>
            </Card>

            <Card className="p-6 border-border bg-card">
              <div className="w-12 h-12 bg-primary rounded-full mb-4 flex items-center justify-center text-white">
                3
              </div>
              <h3 className="text-foreground mb-2">Desktop Optimized</h3>
              <p className="text-muted-foreground text-sm mb-3">Designed for 1440×1024 resolution with spacious layouts and clear hierarchy</p>
              <code className="text-xs text-primary">max-w-7xl mx-auto</code>
            </Card>
          </div>
        </section>

        {/* Quick Reference */}
        <section>
          <div className="mb-6">
            <h2 className="text-foreground mb-2">Quick Reference</h2>
            <p className="text-muted-foreground">Essential values for developers and designers</p>
          </div>

          <Card className="p-6 border-border bg-card">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <h3 className="text-foreground text-sm mb-2">Spacing Scale</h3>
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <div>2px (0.5)</div>
                  <div>4px (1)</div>
                  <div>8px (2)</div>
                  <div>12px (3)</div>
                  <div>16px (4)</div>
                  <div>20px (5)</div>
                  <div>24px (6)</div>
                  <div>32px (8)</div>
                </div>
              </div>

              <div>
                <h3 className="text-foreground text-sm mb-2">Border Radius</h3>
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <div>Cards: 20px</div>
                  <div>Buttons: 6px</div>
                  <div>Badges: 4px</div>
                  <div>Inputs: 6px</div>
                  <div>Avatar: 50%</div>
                </div>
              </div>

              <div>
                <h3 className="text-foreground text-sm mb-2">Font Sizes</h3>
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <div>xs: 12px</div>
                  <div>sm: 14px</div>
                  <div>base: 16px</div>
                  <div>lg: 18px</div>
                  <div>xl: 20px</div>
                  <div>2xl: 24px</div>
                  <div>3xl: 30px</div>
                  <div>4xl: 36px</div>
                </div>
              </div>

              <div>
                <h3 className="text-foreground text-sm mb-2">Font Weights</h3>
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <div>Regular: 400</div>
                  <div>Medium: 500</div>
                  <div>Semibold: 600</div>
                  <div>Bold: 700</div>
                  <div>Extrabold: 800</div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
