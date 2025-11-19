import React, { useState, useRef } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { ImageUploader } from './components/ImageUploader';
import { EraSelector } from './components/EraSelector';
import { Button } from './components/Button';
import { generateTimeTravelImage, editImageWithPrompt, analyzeImage } from './services/geminiService';
import { AppMode, HistoricalEra } from './types';
import ReactMarkdown from 'react-markdown';
import { Clock, Wand2, ScanEye, History, Download, Trash2, ArrowRight, Sparkles, Camera, Upload } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TIME_TRAVEL);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedEra, setSelectedEra] = useState<HistoricalEra | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    setSourceImage(null);
    setGeneratedImage(null);
    setAnalysisResult(null);
    setSelectedEra(null);
    setEditPrompt('');
    setError(null);
  };

  const handleTimeTravel = async () => {
    if (!sourceImage || !selectedEra) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await generateTimeTravelImage(sourceImage, selectedEra.promptSuffix);
      setGeneratedImage(result);
      // Scroll to results after a short delay to ensure rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      setError("Time travel failed. The timeline rejected your request. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMagicEdit = async () => {
    if (!sourceImage || !editPrompt.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      // Use generated image as base if available, otherwise source
      const base = generatedImage || sourceImage;
      const result = await editImageWithPrompt(base, editPrompt);
      setGeneratedImage(result);
       setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      setError("Magic edit failed. Please try a different prompt.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!sourceImage) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await analyzeImage(sourceImage);
      setAnalysisResult(result);
       setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      setError("Analysis failed. The scanner malfunctioned.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `chronolens-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 brand-font">
              ChronoLens
            </span>
          </div>
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => { setMode(AppMode.TIME_TRAVEL); handleReset(); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${mode === AppMode.TIME_TRAVEL ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <span className="flex items-center gap-2"><Clock size={16} /> <span className="hidden sm:inline">Time Travel</span></span>
            </button>
            <button
              onClick={() => { setMode(AppMode.MAGIC_EDITOR); handleReset(); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${mode === AppMode.MAGIC_EDITOR ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <span className="flex items-center gap-2"><Wand2 size={16} /> <span className="hidden sm:inline">Magic Editor</span></span>
            </button>
            <button
              onClick={() => { setMode(AppMode.ANALYZER); handleReset(); }}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${mode === AppMode.ANALYZER ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <span className="flex items-center gap-2"><ScanEye size={16} /> <span className="hidden sm:inline">Analyze</span></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* Hero/Intro Text based on Mode */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight">
            {mode === AppMode.TIME_TRAVEL && <span className="neon-text text-purple-300">Step Into History</span>}
            {mode === AppMode.MAGIC_EDITOR && <span className="neon-text text-indigo-300">Reshape Reality</span>}
            {mode === AppMode.ANALYZER && <span className="neon-text text-emerald-300">Decode the Visual</span>}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {mode === AppMode.TIME_TRAVEL && "Upload or snap a photo, select an era, and let Gemini transport you through time."}
            {mode === AppMode.MAGIC_EDITOR && "Use natural language to add filters, remove objects, or completely transform your images."}
            {mode === AppMode.ANALYZER && "Get deep insights, historical context, and detailed descriptions of any image."}
          </p>
        </div>

        {/* Step 1: Image Input */}
        <div className="grid gap-12">
          {!sourceImage ? (
            <div className="space-y-8 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-start">
                <div className="w-full sm:w-1/2">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Camera className="text-purple-400"/> Webcam</h3>
                   <CameraCapture onCapture={setSourceImage} />
                </div>
                <div className="hidden sm:block w-px bg-slate-800 self-stretch"></div>
                <div className="w-full sm:w-1/2">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Upload className="text-purple-400"/> Upload</h3>
                   <ImageUploader onUpload={setSourceImage} />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              
              {/* Source Image Display & Reset */}
              <div className="flex flex-col items-center space-y-4">
                 <div className="relative group">
                    <img 
                        src={sourceImage} 
                        alt="Source" 
                        className="h-64 w-auto rounded-2xl border-4 border-slate-700 shadow-xl object-cover"
                    />
                    <button 
                        onClick={handleReset}
                        className="absolute top-2 right-2 p-2 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        title="Remove Image"
                    >
                        <Trash2 size={16} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-center py-1 text-xs text-gray-300 rounded-b-xl">Original</div>
                 </div>
              </div>

              {/* Controls Area */}
              <div className="bg-slate-800/50 rounded-3xl p-6 sm:p-10 border border-slate-700 backdrop-blur-sm">
                
                {/* TIME TRAVEL CONTROLS */}
                {mode === AppMode.TIME_TRAVEL && (
                  <div className="space-y-8 text-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Select Your Destination</h2>
                      <p className="text-slate-400 mb-6">Where in time do you want to go?</p>
                      <EraSelector selectedEraId={selectedEra?.id || null} onSelect={setSelectedEra} />
                    </div>
                    <div className="flex justify-center">
                       <Button 
                            disabled={!selectedEra} 
                            onClick={handleTimeTravel} 
                            isLoading={isProcessing}
                            className="w-full sm:w-auto min-w-[200px] text-lg"
                        >
                            <Sparkles className="mr-2"/> Travel Time
                        </Button>
                    </div>
                  </div>
                )}

                {/* MAGIC EDITOR CONTROLS */}
                {mode === AppMode.MAGIC_EDITOR && (
                  <div className="max-w-2xl mx-auto space-y-6 text-center">
                     <h2 className="text-2xl font-bold">Describe Your Edit</h2>
                     <div className="relative">
                        <textarea
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            placeholder="e.g., 'Add a pair of sunglasses', 'Make it look like a pencil sketch', 'Change background to a beach'..."
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32 resize-none"
                        />
                     </div>
                     <Button 
                        disabled={!editPrompt.trim()} 
                        onClick={handleMagicEdit} 
                        isLoading={isProcessing}
                        variant="primary"
                        className="w-full sm:w-auto"
                     >
                        <Wand2 className="mr-2"/> Generate Edit
                     </Button>
                  </div>
                )}

                {/* ANALYZER CONTROLS */}
                {mode === AppMode.ANALYZER && (
                   <div className="text-center space-y-6">
                      <h2 className="text-2xl font-bold">Deep Analysis</h2>
                      <p className="text-slate-400">Gemini Pro Vision will examine every pixel.</p>
                      <Button 
                        onClick={handleAnalyze} 
                        isLoading={isProcessing}
                        variant="primary"
                         className="bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500"
                      >
                        <ScanEye className="mr-2"/> Analyze Now
                     </Button>
                   </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-center animate-pulse">
                        {error}
                    </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Results Section */}
        {(generatedImage || analysisResult) && (
           <div ref={resultsRef} className="mt-16 space-y-8 animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-700 flex-grow"></div>
                    <h2 className="text-3xl font-bold brand-font text-center">Result</h2>
                    <div className="h-px bg-slate-700 flex-grow"></div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                    {/* Generated Image Result */}
                    {generatedImage && (
                        <div className="flex flex-col items-center space-y-4 w-full max-w-2xl">
                            <div className="relative group rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/50 border border-slate-600">
                                <img 
                                    src={generatedImage} 
                                    alt="Generated" 
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                                    <Button onClick={downloadImage} variant="secondary" className="backdrop-blur-md bg-white/20 border-white/30 hover:bg-white/30">
                                        <Download size={20} className="mr-2" /> Save Image
                                    </Button>
                                </div>
                            </div>
                            {mode === AppMode.MAGIC_EDITOR && (
                                <p className="text-sm text-slate-400 italic">"{editPrompt}"</p>
                            )}
                        </div>
                    )}

                    {/* Analysis Text Result */}
                    {analysisResult && (
                        <div className="w-full max-w-3xl bg-slate-800/80 backdrop-blur rounded-2xl p-8 border border-emerald-500/30 shadow-xl shadow-emerald-900/20">
                            <div className="prose prose-invert prose-emerald max-w-none">
                                <ReactMarkdown>{analysisResult}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
           </div>
        )}
      </main>
      
      <footer className="mt-20 py-8 text-center text-slate-600 text-sm border-t border-slate-800">
        <p>Powered by Google Gemini 2.5 Flash & 3.0 Pro</p>
      </footer>
    </div>
  );
};

export default App;