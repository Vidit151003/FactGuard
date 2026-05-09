import { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorks from './components/HowItWorks';
import UploadSection from './components/UploadSection';
import ResultsPanel from './components/ResultsPanel';
import Footer from './components/Footer';

export default function App() {
  const [results, setResults] = useState(null);
  const [claims, setClaims] = useState([]);
  const [stage, setStage] = useState('idle'); // idle | loading | done | error

  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <UploadSection
        onResults={setResults}
        onClaims={setClaims}
        onStageChange={setStage}
        stage={stage}
        results={results}
      />
      {(stage === 'done' || (results && results.length > 0)) && (
        <ResultsPanel results={results || []} claims={claims} stage={stage} />
      )}
      <Footer />
    </>
  );
}
