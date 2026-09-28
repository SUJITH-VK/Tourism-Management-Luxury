import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Copy, 
  Check, 
  BarChart3, 
  RefreshCw, 
  ShieldCheck, 
  DollarSign, 
  Users, 
  Luggage, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { ManagementAiAnalysis } from '../types';

interface AdminAiAnalystProps {
  initialPrompt?: string;
}

const PRESET_PROMPTS = [
  {
    id: 'revenue-audit',
    label: 'Revenue & Margin Audit',
    icon: DollarSign,
    color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    prompt: 'Conduct a comprehensive audit of our gross revenue, GST tax collections, average order value, and top revenue-generating tours. Highlight margin risks.',
  },
  {
    id: 'occupancy-audit',
    label: 'Occupancy & Tour Seats',
    icon: Luggage,
    color: 'from-blue-500/20 to-cyan-500/10 text-cyan-400 border-cyan-500/30',
    prompt: 'Analyze seat occupancy across all tour packages. Which tours are near full capacity, and which have underutilized seats? Suggest inventory rebalancing.',
  },
  {
    id: 'pricing-strategy',
    label: 'Dynamic Pricing & Yield',
    icon: TrendingUp,
    color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    prompt: 'Evaluate our current pricing tiers against demand and season. Recommend pricing adjustments or early-bird discounts to maximize yield for upcoming departures.',
  },
  {
    id: 'vip-retention',
    label: 'VIP Customer Retention',
    icon: Users,
    color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
    prompt: 'Analyze our customer base and membership tiers (Crown Elite, Platinum). How can we increase repeat bookings and lifetime value for high-net-worth clients?',
  },
];

export const AdminAiAnalyst: React.FC<AdminAiAnalystProps> = ({ initialPrompt = '' }) => {
  const [query, setQuery] = useState(initialPrompt);
  const [focusArea, setFocusArea] = useState<string>('all');
  const [analysis, setAnalysis] = useState<ManagementAiAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const runAnalysis = async (customPrompt?: string) => {
    const textToAnalyze = customPrompt || query;
    if (!textToAnalyze.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToAnalyze,
          focusArea,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Analysis request failed with status ${response.status}`);
      }

      const data: ManagementAiAnalysis = await response.json();
      setAnalysis(data);

      if (!history.includes(textToAnalyze)) {
        setHistory((prev) => [textToAnalyze, ...prev.slice(0, 4)]);
      }
    } catch (err: any) {
      console.error('AI Management Analysis error:', err);
      setError(err.message || 'Failed to complete analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!analysis) return;
    const text = `AuraVoyage Executive Management Analysis
Timestamp: ${new Date(analysis.timestamp).toLocaleString('en-IN')}
Focus: ${analysis.focusArea}

EXECUTIVE SUMMARY:
${analysis.summary}

KEY METRICS:
${analysis.keyMetrics.map((m) => `• ${m.label}: ${m.value} (${m.trend || 'N/A'})`).join('\n')}

STRATEGIC RECOMMENDATIONS:
${analysis.recommendations.map((r, i) => `${i + 1}. [${r.priority.toUpperCase()}] ${r.title}: ${r.action}`).join('\n')}

FORECAST:
${analysis.forecast || 'N/A'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-[#0b162c] to-[#090e1a] border border-emerald-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Management Intelligence Assistant • Powered by Gemini 3.8 Flash</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Executive Tourism Analytics & Strategic Forecasting
            </h2>
            <p className="text-sm text-slate-300">
              Query live PostgreSQL management data including revenue streams, seat occupancy, cancellation patterns, and customer lifetime value with actionable strategic recommendations.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Database Sync</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Real-time Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRESET_PROMPTS.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              onClick={() => {
                setQuery(preset.prompt);
                runAnalysis(preset.prompt);
              }}
              disabled={isLoading}
              className={`text-left p-4 rounded-2xl border bg-gradient-to-br transition-all hover:scale-[1.02] active:scale-[0.98] ${preset.color} hover:bg-slate-800/60`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-black/40">
                  <Icon className="w-4 h-4" />
                </div>
                <Zap className="w-3.5 h-3.5 opacity-60" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{preset.label}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{preset.prompt}</p>
            </button>
          );
        })}
      </div>

      {/* Interactive Query Box */}
      <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  runAnalysis();
                }
              }}
              placeholder="Ask anything about tours, revenue, occupancy, or pricing... (e.g. 'Which tours have lowest occupancy?')"
              className="w-full bg-[#070b14] border border-slate-700 focus:border-emerald-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none pr-10"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="bg-[#070b14] border border-slate-700 text-slate-300 text-xs rounded-2xl px-3 py-3 outline-none"
            >
              <option value="all">Comprehensive Analysis</option>
              <option value="revenue">Revenue & Tax</option>
              <option value="inventory">Tour Occupancy</option>
              <option value="customers">Customer CRM</option>
              <option value="pricing">Pricing & Margins</option>
            </select>

            <button
              onClick={() => runAnalysis()}
              disabled={isLoading || !query.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Data</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* History Pills */}
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-[11px] text-slate-500 mr-1">Recent inquiries:</span>
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(h);
                  runAnalysis(h);
                }}
                className="px-2.5 py-1 rounded-full bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] truncate max-w-xs transition-colors"
              >
                {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-sm flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-xs text-rose-300/80 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => runAnalysis()}
            className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-xs font-semibold text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State Skeleton */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-[#0b1222] border border-slate-800 space-y-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
            <div>
              <div className="h-4 w-48 bg-slate-700 rounded-md" />
              <div className="h-3 w-72 bg-slate-800 rounded-md mt-1.5" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-slate-800/60 rounded-2xl p-4 space-y-2">
                <div className="h-3 w-16 bg-slate-700 rounded" />
                <div className="h-6 w-24 bg-slate-700 rounded" />
              </div>
            ))}
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-4 w-full bg-slate-800 rounded" />
            <div className="h-4 w-5/6 bg-slate-800 rounded" />
            <div className="h-4 w-4/6 bg-slate-800 rounded" />
          </div>
        </div>
      )}

      {/* Analysis Output View */}
      {!isLoading && analysis && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          <div className="bg-[#0b1222] border border-emerald-500/30 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl shadow-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Executive Intelligence Synthesis</h3>
                  <span className="text-[11px] text-slate-400">
                    Generated at {new Date(analysis.timestamp).toLocaleTimeString('en-IN')} • Inquiry: &quot;{analysis.query}&quot;
                  </span>
                </div>
              </div>

              <button
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors self-start sm:self-auto"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Brief' : 'Export Brief'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 rounded-2xl p-4 border border-slate-800">
              {analysis.summary}
            </p>

            {/* Key Metrics Grid */}
            {analysis.keyMetrics && analysis.keyMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {analysis.keyMetrics.map((metric, idx) => {
                  const isPositive = metric.status === 'positive' || metric.trend?.includes('+');
                  const isWarning = metric.status === 'warning' || metric.trend?.includes('-');
                  return (
                    <div key={idx} className="bg-[#070b14] border border-slate-800 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block truncate">
                        {metric.label}
                      </span>
                      <p className="text-xl font-bold text-white font-display">
                        {metric.value}
                      </p>
                      {metric.trend && (
                        <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                          isPositive ? 'text-emerald-400' : isWarning ? 'text-amber-400' : 'text-slate-400'
                        }`}>
                          <TrendingUp className="w-3 h-3" /> {metric.trend}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Deep Insights & Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Observations & Findings */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <h4 className="text-base font-bold text-white">Diagnostic Insights</h4>
              </div>

              <div className="space-y-3">
                {analysis.insights && analysis.insights.length > 0 ? (
                  analysis.insights.map((insight, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#070b14] border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {insight.category}
                        </span>
                      </div>
                      <p className="text-xs text-white font-medium">{insight.observation}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                        <span className="text-emerald-400 font-semibold">Impact:</span> {insight.impact}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">No specific diagnostic observations found.</p>
                )}
              </div>
            </div>

            {/* 2. Actionable Recommendations */}
            <div className="bg-[#0b1222] border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-base font-bold text-white">Strategic Action Plan</h4>
              </div>

              <div className="space-y-3">
                {analysis.recommendations && analysis.recommendations.length > 0 ? (
                  analysis.recommendations.map((rec, idx) => {
                    const priorityColor = 
                      rec.priority === 'high' 
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                        : rec.priority === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-[#070b14] border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-bold text-white">{rec.title}</h5>
                          <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}>
                            {rec.priority} Priority
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{rec.action}</p>
                        <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <ArrowRight className="w-3 h-3 shrink-0" />
                          <span>Expected Outcome: {rec.expectedOutcome}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">No strategic recommendations provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Operational Forecast */}
          {analysis.forecast && (
            <div className="bg-gradient-to-r from-[#0b1222] via-[#0d172e] to-[#0b1222] border border-slate-800 rounded-3xl p-5 sm:p-6 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-bold text-white">Market & Seasonal Outlook</h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{analysis.forecast}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !analysis && (
        <div className="p-12 text-center bg-[#0b1222] border border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Ready to Analyze Management Data</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Select one of the presets above or enter a custom question to extract instant strategic intelligence from current bookings, tour inventories, and revenue figures.
          </p>
        </div>
      )}
    </div>
  );
};
