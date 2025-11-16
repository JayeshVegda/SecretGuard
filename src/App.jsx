import { useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TextComparator from './components/TextComparator';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';

export default function App() {
  const [originalText, setOriginalText] = useState('');
  const [matches, setMatches] = useState([]);
  const [maskingPolicy, setMaskingPolicy] = useState(undefined);

  const handleMatchesDetected = useCallback((detectedMatches) => {
    setMatches(detectedMatches);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TextComparator
          originalText={originalText}
          onTextChange={setOriginalText}
          onMatchesDetected={handleMatchesDetected}
          maskingPolicy={maskingPolicy}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrustSection />
      </div>
      
      <Footer />
    </div>
  );
}
