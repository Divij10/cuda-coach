import React, { useState, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import LessonContent from './components/LessonContent';
import InteractivePane from './components/InteractivePane';
import ProgressTracker from './components/ProgressTracker';
import WelcomeScreen from './components/WelcomeScreen';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Menu, X, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const [selectedLessonId, setSelectedLessonId] = useState('lesson-1-1');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSelectLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleProgress = () => {
    setShowProgress(!showProgress);
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <div className="h-screen bg-background text-foreground dark min-h-screen w-full">
      {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      <div className="flex h-full w-full bg-background">
        {/* Mobile overlay */}
        {!sidebarCollapsed && isMobile && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Sidebar */}
        <div className={`${
          isMobile ? 'fixed left-0 top-0 h-full z-50' : 'relative'
        } ${
          sidebarCollapsed 
            ? (isMobile ? '-translate-x-full' : 'w-16') 
            : (isMobile ? 'w-80' : 'w-80')
        } transition-all duration-300 flex-shrink-0`}>
          {sidebarCollapsed && !isMobile ? (
            <Card className="h-full w-16 rounded-none border-r border-border flex flex-col items-center py-4 bg-card/95 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mb-4 bg-primary/10 hover:bg-primary/20 group"
                title="Expand Sidebar"
              >
                <ChevronRight className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleProgress}
                className={`mb-4 ${showProgress ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
                title="Progress Tracker"
              >
                <BarChart3 className="h-5 w-5" />
              </Button>
              
              {/* Vertical CudaCoach label */}
              <div className="flex-1 flex items-center justify-center">
                <div className="transform -rotate-90 whitespace-nowrap">
                  <span className="text-xs font-bold text-primary">CudaCoach</span>
                </div>
              </div>
            </Card>
          ) : (
            <div className="h-full w-80">
              <Sidebar 
                onSelectLesson={handleSelectLesson}
                selectedLessonId={selectedLessonId}
              />
              {/* Collapse button for desktop */}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="absolute top-4 right-2 z-10 bg-background/80 hover:bg-background border border-border shadow-sm"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {/* Close button for mobile */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background border border-border shadow-sm"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1 flex bg-background min-w-0">
          {/* Progress tracker (when sidebar is collapsed) */}
          {sidebarCollapsed && showProgress && !isMobile && (
            <div className="w-80 border-r border-border overflow-auto flex-shrink-0">
              <div className="p-4">
                <ProgressTracker selectedLessonId={selectedLessonId} />
              </div>
            </div>
          )}

          {/* Lesson content */}
          <div className="flex-1 flex bg-background min-w-0">
            <div className="flex-1 bg-background min-w-0">
              {/* Mobile header */}
              {isMobile && sidebarCollapsed && (
                <div className="bg-card border-b border-border p-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <h1 className="text-lg font-semibold">CudaCoach</h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleProgress}
                    className={showProgress ? "bg-accent" : ""}
                  >
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                </div>
              )}
              
              <LessonContent lessonId={selectedLessonId} />
            </div>

            {/* Interactive pane */}
            <div className={`${isMobile ? 'hidden lg:block' : ''} flex-shrink-0`}>
              <InteractivePane lessonId={selectedLessonId} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation for interactive features */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden">
          <div className="flex">
            <Button
              variant="ghost"
              className="flex-1 h-12 rounded-none"
              onClick={() => {
                // Show chat modal or navigate to chat view
                console.log('Open chat');
              }}
            >
              Chat
            </Button>
            <Button
              variant="ghost"
              className="flex-1 h-12 rounded-none"
              onClick={() => {
                // Show code lab modal or navigate to code view
                console.log('Open code lab');
              }}
            >
              Code Lab
            </Button>
            <Button
              variant="ghost"
              className="flex-1 h-12 rounded-none"
              onClick={() => {
                // Show quiz modal or navigate to quiz view
                console.log('Open quiz');
              }}
            >
              Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App; 