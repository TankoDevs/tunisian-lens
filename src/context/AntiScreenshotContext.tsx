import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const checkIsMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|Silk/i;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isNarrowScreen = window.innerWidth <= 840;
  return mobileRegex.test(userAgent) || (isTouch && isNarrowScreen);
};

interface AntiScreenshotContextType {
  isShieldActive: boolean;
  shieldReason: string;
  triggerShield: (reason?: string) => void;
  isViewingProtected: boolean;
  setIsViewingProtected: (viewing: boolean) => void;
  isMobile: boolean;
}

const AntiScreenshotContext = createContext<AntiScreenshotContextType | undefined>(undefined);

const COPYRIGHT_NOTICE = 
  "© TUNISIAN LENS ARCHIVE — Registered Cultural Photography. Unauthorized digital reproduction, scraping, or screen capture is prohibited under Tunisian Intellectual Property Rights. Visit: https://tunisian-lens.pages.dev";

export const AntiScreenshotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [shieldReason, setShieldReason] = useState<string>('Screen capture restricted');
  const [isViewingProtected, setIsViewingProtected] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => checkIsMobileDevice());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkIsMobileDevice());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerShield = useCallback((reason = 'Screen capture shortcut restricted') => {
    // Never trigger shield or restrict captures on mobile phones
    if (checkIsMobileDevice()) {
      return;
    }

    setShieldReason(reason);
    setIsShieldActive(true);

    // Overwrite system clipboard to prevent pasting captured plate on desktop
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(COPYRIGHT_NOTICE).catch(() => {});
      }
    } catch {
      // Ignore clipboard write restrictions if not focused
    }

    // Auto dismiss shield notification after 3 seconds
    const timer = setTimeout(() => {
      setIsShieldActive(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If on a mobile phone, don't register intrusive desktop screenshot interceptors
    if (checkIsMobileDevice()) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Windows PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        triggerShield('PrintScreen intercepted — Plate is copyright-protected');
        return;
      }

      // macOS Screenshot shortcuts: Cmd + Shift + 3, Cmd + Shift + 4, Cmd + Shift + 5
      if (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) {
        e.preventDefault();
        triggerShield('Screen clipping shortcut restricted by archival security');
        return;
      }

      // Windows Snipping shortcut: Win/Ctrl + Shift + S
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerShield('Screen snippet shortcut restricted');
        return;
      }

      // Print shortcut: Ctrl + P / Cmd + P
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerShield('Printing restricted for high-resolution archival plates');
        return;
      }

      // Save page: Ctrl + S / Cmd + S
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerShield('Direct plate save disabled — use official licensing options');
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        triggerShield('PrintScreen intercepted — Plate is copyright-protected');
      }
    };

    // When window loses focus while viewing high-res photo (e.g. Snipping Tool overlay on desktop)
    const handleWindowBlur = () => {
      // Allow seamless screenshots on mobile phones without activating privacy veil
      if (checkIsMobileDevice()) return;

      if (isViewingProtected) {
        setIsShieldActive(true);
        setShieldReason('Window blurred — Archival privacy veil active');
      }
    };

    const handleWindowFocus = () => {
      if (isViewingProtected) {
        // Softly clear after returning
        setTimeout(() => {
          setIsShieldActive(false);
        }, 500);
      }
    };

    // Prevent global context menu on desktop elements marked data-protected
    const handleContextMenu = (e: MouseEvent) => {
      if (checkIsMobileDevice()) return;

      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-protected-image]')) {
        e.preventDefault();
        triggerShield('Right-click image saving is disabled for archival photographs');
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [triggerShield, isViewingProtected]);

  return (
    <AntiScreenshotContext.Provider
      value={{
        isShieldActive: isMobile ? false : isShieldActive,
        shieldReason,
        triggerShield,
        isViewingProtected,
        setIsViewingProtected,
        isMobile,
      }}
    >
      {children}

      {/* Museum-Grade Security Alert Overlay */}
      <AnimatePresence>
        {isShieldActive && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] max-w-lg w-[92%] px-4"
          >
            <div className="bg-surface/95 border border-ochre/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3.5 text-alabaster ring-1 ring-ochre/20">
              <div className="p-2.5 rounded-xl bg-ochre/15 text-ochre shrink-0 mt-0.5 border border-ochre/30">
                <ShieldAlert size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-ochre font-bold">
                    Archival Rights Charter
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/15 text-red-400 font-mono border border-red-500/25">
                    CAPTURE RESTRICTED
                  </span>
                </div>
                <h4 className="text-sm font-medium text-alabaster mt-0.5">
                  {shieldReason}
                </h4>
                <p className="text-xs text-mist font-light mt-1 leading-relaxed">
                  Photographs in this cultural archive are protected under international copyright &amp; digital provenance registry. All reproductions must be licensed.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AntiScreenshotContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAntiScreenshot = () => {
  const context = useContext(AntiScreenshotContext);
  if (!context) {
    throw new Error('useAntiScreenshot must be used within an AntiScreenshotProvider');
  }
  return context;
};
