import { Badge } from './ui/badge';
import { Shield, CheckCircle2, Zap, Lock, Sparkles } from 'lucide-react';
import { Card } from './ui/card';

interface HeroProps {
  onGetStarted?: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Badge */}
        <div className="flex justify-center">
          <Badge 
            variant="success" 
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium backdrop-blur-sm bg-teal-500/20 border-teal-500/30 shadow-lg shadow-teal-500/10"
          >
            <Shield className="h-3 w-3" strokeWidth={2.5} />
            100% Client-Side • Your Data Never Leaves Your Browser
          </Badge>
        </div>

        {/* Main Heading */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Protect Your Secrets
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Before AI Sees Them
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Automatically detect and mask sensitive data before sharing with ChatGPT, Claude, Gemini, or any LLM.
            <span className="font-medium text-foreground"> Zero setup. Complete privacy.</span>
          </p>
        </div>

        {/* Feature Pills - Compact */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {[
            { icon: '🔒', label: 'Personal Info', sublabel: 'SSN, Phone, Email' },
            { icon: '🔑', label: 'API Keys', sublabel: 'AWS & Secrets' },
            { icon: '💳', label: 'Payment Info', sublabel: 'Cards & Banking' },
            { icon: '🗄️', label: 'Database', sublabel: 'Credentials' },
            { icon: '🔐', label: 'Passwords', sublabel: 'Tokens & Keys' },
          ].map((item, idx) => (
            <Card key={idx} className="group px-4 py-2 border-teal-200/40 dark:border-teal-800/40 hover:border-teal-400/60 dark:hover:border-teal-600/60 transition-all duration-300 hover:scale-105 cursor-default">
              <div className="flex items-center gap-2.5">
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground leading-tight">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground font-light">{item.sublabel}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators - Compact */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs pt-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 dark:border-teal-400/20">
              <Zap className="h-3 w-3 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
            </div>
            <span className="font-medium text-foreground">Free Forever</span>
          </div>
          <span className="text-border/50">•</span>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 dark:border-teal-400/20">
              <Lock className="h-3 w-3 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
            </div>
            <span className="font-medium text-foreground">No Sign-Up</span>
          </div>
          <span className="text-border/50">•</span>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-500/10 dark:bg-teal-400/10 border border-teal-500/20 dark:border-teal-400/20">
              <Sparkles className="h-3 w-3 text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
            </div>
            <span className="font-medium text-foreground">Instant Protection</span>
          </div>
        </div>
      </div>
    </main>
  );
}
