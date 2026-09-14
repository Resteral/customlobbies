import React from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CustomerCardView } from './components/CustomerCardView';
import { ReviewGateModal } from './components/ReviewGateModal';
import { ReviewStandalonePage } from './components/ReviewStandalonePage';
import { CashierTerminal } from './components/CashierTerminal';
import { MerchantDashboard } from './components/MerchantDashboard';
import { QRStudio } from './components/QRStudio';
import { PitchCalculator } from './components/PitchCalculator';
import { Wifi, Battery, Signal, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, viewMode, currentBusiness } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 py-6 px-3 sm:px-6">
        {activeTab === 'customer-card' && (
          <div>
            {viewMode === 'mobile-preview' ? (
              /* Realistic Mobile Phone Frame Container */
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-full max-w-[400px] bg-slate-900 border-[10px] border-slate-800 rounded-[50px] shadow-2xl overflow-hidden relative ring-1 ring-slate-700/50">
                  {/* Speaker & Dynamic Island / Notch */}
                  <div className="pt-3 px-6 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>9:41</span>
                    <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto" />
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3 h-3" />
                      <Wifi className="w-3 h-3" />
                      <Battery className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  {/* Inside Screen Content */}
                  <div className="min-h-[640px] p-2 flex flex-col justify-center">
                    <CustomerCardView />
                  </div>

                  {/* Bottom Home Indicator */}
                  <div className="pb-3 flex justify-center">
                    <div className="w-32 h-1 bg-slate-700 rounded-full" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center mt-3 no-print">
                  💡 This is what customers see in their mobile browser (zero app download required).
                </p>
              </div>
            ) : (
              /* Fluid View */
              <div className="py-6">
                <CustomerCardView />
              </div>
            )}
          </div>
        )}

        {activeTab === 'review-qr' && <ReviewStandalonePage />}
        {activeTab === 'cashier-terminal' && <CashierTerminal />}
        {activeTab === 'dashboard' && <MerchantDashboard />}
        {activeTab === 'qr-studio' && <QRStudio />}
        {activeTab === 'pitch-calculator' && <PitchCalculator />}
      </main>

      {/* Global Review Gate Modal */}
      <ReviewGateModal />

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>PerkPulse • The All-in-One Local Customer Loyalty & Review Acceleration Engine</p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;
