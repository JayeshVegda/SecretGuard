import { Github, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/20 bg-background/70 backdrop-blur-xl mt-16 py-8 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          {/* Brand section */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400" />
            <span className="text-sm font-medium">SecretGuard</span>
          </div>
          
          {/* Main content */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1 text-sm text-muted-foreground">
            <span>© 2025 SecretGuard by</span>
            <a 
              href="https://github.com/JayeshVegda" 
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-all font-medium hover:underline"
            >
              <span>Jayesh Vegda</span>
              <Github className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
            <span className="hidden sm:inline">— Share freely. Stay secure.</span>
          </div>
          
          {/* Tagline for mobile */}
          <p className="sm:hidden text-xs text-muted-foreground/80 italic">
            Share freely. Stay secure.
          </p>
          
          {/* Repository link */}
          <a
            href="https://github.com/JayeshVegda/SecretGuard"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors mt-1"
          >
            <Github className="h-3 w-3" />
            <span className="group-hover:underline">View on GitHub</span>
          </a>
          
          {/* Made with love */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground/60 mt-2">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
            <span>for privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
