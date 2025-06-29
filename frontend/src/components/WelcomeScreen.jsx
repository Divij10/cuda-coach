import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';

const WelcomeScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Removed auto-dismiss - only dismiss on click

  const handleExit = () => {
    setIsAnimatingOut(true);
    // Complete the transition after animation
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`welcome-screen flex items-center justify-center transition-all duration-800 ${
        isAnimatingOut ? 'transform -translate-y-full opacity-0' : ''
      }`}
      onClick={handleExit}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.15),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(34,197,94,0.05),transparent)]"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto px-8">
        {/* Logo/Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl floating">
            <div className="text-4xl font-bold text-primary-foreground">⚡</div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-xl animate-pulse-slow"></div>
        </div>

        {/* Main title */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-green-400 to-emerald-500 bg-clip-text text-transparent animate-fade-in">
            CudaCoach
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-emerald-500 mx-auto rounded-full animate-scale-in"></div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground animate-slide-in-right">
          Interactive CUDA Learning Platform
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 enhanced-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-semibold text-primary mb-2">AI Tutor</h3>
            <p className="text-sm text-muted-foreground">Get personalized guidance</p>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 enhanced-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💻</span>
            </div>
            <h3 className="font-semibold text-primary mb-2">Live Coding</h3>
            <p className="text-sm text-muted-foreground">Practice with real code</p>
          </Card>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-primary/20 enhanced-hover">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-primary mb-2">GPU Profiling</h3>
            <p className="text-sm text-muted-foreground">Optimize performance</p>
          </Card>
        </div>

        {/* Click to continue hint */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '1s' }}>
          <p className="text-sm text-muted-foreground mb-2">Click anywhere to start learning</p>
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-primary/50 rounded-full flex items-center justify-center animate-bounce">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen; 