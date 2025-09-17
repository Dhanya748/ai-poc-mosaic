import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SVGProps } from "react";

// Helper component for Feature Icons (as we don't have a library)
type IconProps = SVGProps<SVGSVGElement>;

const UserGroupIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const BotIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
);
const ZapIcon = (props: IconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const TargetIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const MessageCircleIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
const DatabaseIcon = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
);

export default function DataMosaicLandingPage() {
  const features = [
    {
      icon: UserGroupIcon,
      name: "Advanced Identity Resolution",
      description: "Unify customer data from all sources into a single, actionable profile directly in your data warehouse.",
    },
    {
      icon: MessageCircleIcon,
      name: "Natural Language Segment Builder",
      description: "Empower your entire team to build complex audiences by simply describing what they need in plain English.",
    },
    {
      icon: TargetIcon,
      name: "Goal-Based Action Recommendation",
      description: "Translate marketing goals into AI-driven actions. The system recommends the best offer, channel, and timing.",
    },
    {
      icon: BotIcon,
      name: "AI-Powered Content Personalization",
      description: "Generate personalized emails, SMS, and push notifications with AI, tailored to each user segment.",
    },
    {
      icon: ZapIcon,
      name: "Reverse ETL Activation Pipeline",
      description: "Automatically sync segments and decisions to all your marketing and sales tools for seamless activation.",
    },
    {
      icon: DatabaseIcon,
      name: "Warehouse-Native Architecture",
      description: "Runs directly on top of your existing data warehouse, ensuring data never leaves your secure environment.",
    },
  ];

  return (
    <div className="w-full bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900 to-gray-950" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(30%_30%_at_10%_10%,hsl(260_80%_50%/0.15),transparent_60%),radial-gradient(40%_40%_at_90%_20%,hsl(280_90%_60%/0.2),transparent_70%)]" />
        <div className="container py-24 md:py-32 grid gap-12 md:grid-cols-2 items-center">
          <div className="animate-fade-in-up">
            <p className="text-sm text-purple-400 font-semibold">DATA MOSAIC INTELLIGENCE SYSTEM</p>
            <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
              Your AI Co-pilot for Precision Marketing
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-prose">
              Define goals and guardrails. Let Data Mosaic's intelligence agent pick the perfect message, offer, channel, and timing—safely—with full human oversight.
            </p>
            <p className="mt-4 text-sm text-gray-400">
                A Customer Data & Activation Platform by <a href="#" className="font-semibold text-purple-400 hover:underline">Ironbook AI</a>
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 h-12 px-6 text-base font-semibold">
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="h-12 px-6 text-base font-semibold bg-white/10 hover:bg-white/20 text-white">
                <Link to="/demo">Request a Demo</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-6 shadow-2xl shadow-purple-900/20 backdrop-blur-md animate-fade-in">
             <p className="text-center font-medium text-gray-200 mb-4">The Data Mosaic Decision Loop</p>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-gray-400">1. Campaign Goal</p>
                <p className="font-semibold text-white mt-1">Maximize Conversions</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-gray-400">2. Guardrails</p>
                <p className="font-semibold text-white mt-1">Brand Safety + Frequency Caps</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-gray-400">3. AI Decision Output</p>
                <p className="font-semibold text-white mt-1">Offer A via Email at 9 AM</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <p className="text-gray-400">4. Learning Loop</p>
                <p className="font-semibold text-white mt-1">Improving CTR by 7%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Mockup Section */}
      <section className="py-20 sm:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Build Audiences with the Speed of Thought</h2>
            <p className="mt-4 text-lg text-gray-400">
              Our intuitive builders, powered by generative AI, turn your marketing ideas into actionable segments in seconds. No SQL required.
            </p>
          </div>

          <div className="mt-12 relative">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-500 rounded-full mix-blend-lighten filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

            <div className="relative mx-auto border-gray-800 bg-gray-900 border-[8px] rounded-t-xl w-full shadow-2xl shadow-purple-900/30">
                <div className="rounded-lg overflow-hidden bg-gray-900 flex">
                    {/* Sidebar Mockup */}
                    <div className="hidden md:flex w-64 min-h-[450px] bg-gradient-to-b from-gray-900 to-purple-900/50 text-white flex-col p-2">
                        <div className="flex items-center space-x-2 border-b border-white/10 p-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-bold text-purple-300">I</div>
                            <h1 className="text-xl font-bold">Data Mosaic</h1>
                        </div>
                        <nav className="flex-1 space-y-2 py-4">
                            <div className="flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium bg-white/10 text-white"><span>▶</span> <span>Audience</span></div>
                            <div className="flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-300"><span>▶</span> <span>Activations</span></div>
                            <div className="flex items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-300"><span>▶</span> <span>Sources</span></div>
                        </nav>
                    </div>

                    {/* Main Content Mockup */}
                    <div className="flex-1 p-6">
                        <h3 className="text-xl font-semibold text-white">Natural Language Segment Builder</h3>
                        <div className="mt-6 space-y-4">
                            <div className="p-4 rounded-lg bg-gray-800 w-fit max-w-[80%] ml-auto">
                                <p className="text-gray-200">Show me users who purchased in the last 30 days but haven't opened an email this week.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-900/50 w-fit max-w-[80%]">
                                <p className="text-sm font-semibold text-purple-300 mb-2">Data Mosaic agent is generating SQL...</p>
                                <pre className="text-xs text-gray-300 bg-gray-900/50 p-3 rounded-md overflow-x-auto"><code>
                                  {`SELECT user_id FROM users\nWHERE last_purchase_date > NOW() - INTERVAL '30 days'\n  AND user_id NOT IN (\n    SELECT user_id FROM email_events\n    WHERE event_type = 'open'\n      AND event_date > NOW() - INTERVAL '7 days'\n  );`}
                                </code></pre>
                            </div>
                             <div className="p-4 rounded-lg border border-white/10 bg-white/5 w-fit max-w-[80%]">
                                <p className="text-sm font-semibold text-gray-200">Segment Found: <span className="text-sky-400">14,288 users</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-24 bg-gray-900">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A Complete Toolkit for Intelligent Marketing</h2>
            <p className="mt-4 text-lg text-gray-400">
              From unified data profiles to automated multi-channel activation, Data Mosaic provides an end-to-end solution.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="p-6 rounded-xl border border-white/10 bg-gray-950/30 transition-all hover:bg-purple-900/20 hover:border-purple-800/50">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-900/50 text-purple-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 to-gray-950" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_40%_at_50%_100%,hsl(280_90%_60%/0.25),transparent_70%)]" />
        <div className="container text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">Ready to Revolutionize Your Marketing?</h2>
            <p className="mt-5 text-lg text-gray-300">
                Stop guessing and start decisioning. Let Data Mosaic be the intelligent co-pilot that drives your growth.
            </p>
            <div className="mt-10 flex justify-center gap-4">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 h-12 px-8 text-base font-semibold">
                    <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="h-12 px-8 text-base font-semibold bg-white/10 hover:bg-white/20 text-white">
                    <Link to="/login">Login</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-sky-400">Ironbook AI</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">AI-powered data migration platform and enterprise
                        AI solutions for seamless digital transformation.</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Solutions</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">AI Accelerated
                                Migrations</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">Enterprise AI
                                Agents</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">Data
                                Engineering</a></li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Partnerships</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">AWS</a></li>
                        <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">Databricks</a>
                        </li>
                        <li><a href="#" className="text-gray-300 hover:text-violet-400 transition-colors">Snowflake</a></li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-white">Contact</h4>
                    <button
                        className="open-contact-modal flex items-center space-x-2 text-gray-300 hover:text-violet-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                            </path>
                        </svg>
                        <span>hello@ironbook.ai</span>
                    </button>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                <p className="text-gray-400 text-sm">© 2025 Ironbook AI. All rights reserved.</p>
            </div>
        </div>
    </footer>
    </div>
  );
}