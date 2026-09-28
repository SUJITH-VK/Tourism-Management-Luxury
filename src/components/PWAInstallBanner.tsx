import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Download, 
  Share, 
  PlusSquare, 
  X, 
  Sparkles, 
  CheckCircle,
  Smartphone,
  Compass
} from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isIOS, hasPrompt, triggerInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running standalone or dismissed, do not render banner
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (hasPrompt) {
      const success = await triggerInstall();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      // Browser hasn't fired beforeinstallprompt or desktop manual
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {/* Floating or Top PWA Install Bar */}
      <div 
        id="pwa-install-banner"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-[#0e172a]/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-2xl shadow-black/80 p-4 transition-all duration-300 animate-in slide-in-from-bottom-5"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-[1.5px] shrink-0 shadow-md shadow-emerald-500/20">
            <div className="w-full h-full bg-[#080d19] rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white tracking-wide">Install AuraVoyage App</h4>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                Fast & Offline
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Add to your home screen for instantaneous access, offline luxury itinerary viewing, and standalone experience.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070b12] text-xs font-bold shadow-md shadow-emerald-500/30 transition-all active:scale-95 cursor-pointer"
                id="pwa-banner-install-action"
              >
                {isIOS ? (
                  <>
                    <Share className="w-3.5 h-3.5" />
                    <span>How to Install</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Install App</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs font-medium transition-colors"
              >
                Not now
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss install banner"
            className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari / Manual Installation Modal Guide */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#0e172a] border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Install on Your Device</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold shrink-0">1</div>
                <div>
                  <p className="font-semibold text-white">Tap the Share icon</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    In Safari's navigation bar at the bottom (or top on iPad), tap the <strong className="text-emerald-300">Share</strong> button (<Share className="w-3 h-3 inline mx-0.5" />).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold shrink-0">2</div>
                <div>
                  <p className="font-semibold text-white">Select "Add to Home Screen"</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Scroll down in the share sheet and tap <strong className="text-emerald-300">"Add to Home Screen"</strong> (<PlusSquare className="w-3 h-3 inline mx-0.5" />).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold shrink-0">3</div>
                <div>
                  <p className="font-semibold text-white">Tap "Add" in Top Right</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    AuraVoyage will appear on your device home screen as a standalone application.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {installSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-950 border border-emerald-500/50 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 text-xs text-emerald-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>AuraVoyage app installed successfully!</span>
        </div>
      )}
    </>
  );
};
