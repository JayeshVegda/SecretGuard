import ThemeToggle from './ThemeToggle';
import { Shield, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Header() {
  return (
    <header className="sticky z-50 top-0 bg-background/80 backdrop-blur-2xl border-b border-border/30 shadow-lg shadow-black/5 dark:shadow-black/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-xl",
              "bg-gradient-to-br from-teal-500/20 to-cyan-500/20 dark:from-teal-400/20 dark:to-cyan-400/20",
              "backdrop-blur-md border border-teal-500/30 dark:border-teal-400/30",
              "shadow-xl shadow-teal-500/20 dark:shadow-teal-400/20",
              "transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-teal-500/30",
              "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-teal-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
            )}>
              <Shield className="h-6 w-6 text-teal-600 dark:text-teal-400 relative z-10" strokeWidth={2.5} />
              <Sparkles className="absolute h-3.5 w-3.5 text-teal-400 dark:text-teal-300 -top-0.5 -right-0.5 opacity-60 animate-pulse" strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                SecretGuard
              </h1>
              <p className="text-[11px] text-muted-foreground font-light leading-tight tracking-wide">
                AI-safe data protection
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
