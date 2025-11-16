export default function Footer() {
  return (
    <footer className="border-t border-border/20 bg-background/70 backdrop-blur-xl mt-16 py-10 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground font-light">
          © 2025 SecretGuard by{' '}
          <a 
            href="https://github.com/jspw" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-medium"
          >
            jspw
          </a>
          {' '}— Share freely. Stay secure.
        </p>
      </div>
    </footer>
  );
}
