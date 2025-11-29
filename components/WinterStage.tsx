
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Snowflake } from 'lucide-react';
import Snowfall from './Snowfall';

// Default winter-themed transparent GIF
const DEFAULT_GIF = "https://zh.minecraft.wiki/images/Enchanting_Table.gif?d3582";

const WinterStage: React.FC = () => {
  const [gifSrc, setGifSrc] = useState<string | null>(null);
  // We use this key to force the browser to re-render the img element,
  // effectively restarting the GIF animation from frame 0.
  const [gifKey, setGifKey] = useState(0); 
  const [isBumping, setIsBumping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setGifSrc(objectUrl);
      restartGif();
    }
  };

  const restartGif = () => {
    setGifKey(prev => prev + 1);
    
    // Trigger visual feedback
    setIsBumping(true);
    setTimeout(() => setIsBumping(false), 150);
  };

  const handleStageClick = () => {
    restartGif();
  };

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (gifSrc && gifSrc.startsWith('blob:')) {
        URL.revokeObjectURL(gifSrc);
      }
    };
  }, [gifSrc]);

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-pointer select-none bg-[#050505] flex items-center justify-center"
      onClick={handleStageClick}
    >
      {/* 1. Deep Background Layer */}
      <div className="absolute inset-0 bg-slate-950 z-0" />
      
      {/* 2. Snowfall (Global - Behind the light beam for depth) */}
      <Snowfall />

      {/* 3. FLOOR LIGHTING (The Spot on the Ground) */}
      {/* This creates the landing zone for the light. Behind the GIF. */}
      <div 
        className="absolute top-1/2 left-1/2 w-[120vw] h-[120vw] md:w-[800px] md:h-[800px] opacity-60 pointer-events-none z-10"
        style={{
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle at center, rgba(120, 160, 200, 0.25) 0%, rgba(50, 80, 120, 0.05) 45%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 4. THE STAGE (GIF Container) */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-2xl aspect-square">
        
        {/* CAST SHADOW: Distinct shadow projected to Bottom-Left (opposite of Top-Right light) */}
        <div 
          className="absolute top-[65%] left-[40%] w-[50%] h-[15%] rounded-[100%] opacity-80 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 70%)',
            transform: 'translate(-50%, -50%) rotate(-25deg) skewX(20deg)',
            filter: 'blur(8px)',
          }}
        />

        {/* THE GIF ACTOR */}
        <div 
          className={`
            relative z-20 transition-transform duration-150 ease-out
            ${isBumping ? 'scale-95' : 'scale-100'}
          `}
        >
          {(gifSrc || DEFAULT_GIF) && (
            <img 
              key={gifKey}
              src={gifSrc || DEFAULT_GIF} 
              alt="Winter Spotlight" 
              className="max-h-[50vh] max-w-[80vw] object-contain relative z-20"
              style={{ 
                // Minimal drop shadow on the object itself, rely on the floor shadow for grounding
                filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))',
              }}
            />
          )}
        </div>
      </div>

      {/* 5. GLOBAL VOLUMETRIC LIGHT BEAMS (Overlay on top of everything) */}
      {/* This ensures the light looks like it's "in the air" in front of the object */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden mix-blend-screen">
        
        {/* Main Beam: Cone from Top Right */}
        <div 
          className="absolute -top-[50%] -right-[50%] w-[200%] h-[200%] origin-center"
          style={{
            background: 'conic-gradient(from 215deg at 50% 50%, transparent 0deg, rgba(200, 230, 255, 0.0) 10deg, rgba(220, 240, 255, 0.15) 25deg, rgba(220, 240, 255, 0.02) 40deg, transparent 55deg)',
            filter: 'blur(60px)',
          }}
        />

        {/* God Rays: Streaks inside the beam */}
        <div 
          className="absolute -top-[20%] right-0 w-[150%] h-[150%] origin-top-right opacity-30"
          style={{
            background: 'repeating-linear-gradient(225deg, transparent 0%, rgba(255,255,255,0.05) 5%, transparent 10%, transparent 20%)',
            filter: 'blur(8px)',
          }}
        />
        
        {/* Bloom Center: Hotspot near the object */}
        <div 
          className="absolute top-1/2 left-1/2 w-[60%] h-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* 6. VIGNETTE (The Environment) */}
      {/* Darkens the edges, forcing focus to the center */}
      <div 
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(circle at 55% 45%, transparent 20%, rgba(5, 10, 20, 0.6) 50%, rgba(0, 0, 0, 1) 95%)'
        }}
      />

      {/* 7. TEXTURE */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.08] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* UI Controls */}
      <div className="absolute top-6 right-6 z-[60]" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/5 backdrop-blur-md border border-white/10 text-slate-400 p-3 rounded-full hover:bg-white/10 hover:text-white transition-all active:scale-95"
        >
          <Upload className="w-5 h-5" />
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/gif" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      <div className="absolute top-6 left-6 z-[60] pointer-events-none opacity-30">
        <div className="flex items-center gap-2 text-slate-400">
          <Snowflake className="w-4 h-4" />
          <span className="text-xs uppercase tracking-[0.3em] font-light">Winter Stage</span>
        </div>
      </div>

    </div>
  );
};

export default WinterStage;
