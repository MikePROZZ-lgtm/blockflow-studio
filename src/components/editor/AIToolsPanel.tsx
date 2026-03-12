import React, { useState, useCallback } from 'react';
import { Sparkles, Palette, FileText, Search, Share2, Zap, ChevronDown, Check, Loader2, X, Globe } from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';
import { getIndustries, getCategoriesByIndustry, getSubServices } from '@/ai/taxonomy';
import { runAIPipeline, analyzeSkeleton, type PipelineStep } from '@/ai/orchestrator';
import type { AIContext, AIPipelineResult, ContentLanguage, SEOPage, SMMPost } from '@/ai/types';
import { LANGUAGE_LABELS } from '@/ai/types';

interface AIToolsPanelProps {
  onClose: () => void;
}

type Tab = 'config' | 'results';

const STEP_LABELS: Record<PipelineStep, string> = {
  design: 'Design Theme',
  content: 'Content',
  seo: 'SEO Pages',
  smm: 'Social Media',
};

const STEP_ICONS: Record<PipelineStep, React.ReactNode> = {
  design: <Palette className="w-4 h-4" />,
  content: <FileText className="w-4 h-4" />,
  seo: <Search className="w-4 h-4" />,
  smm: <Share2 className="w-4 h-4" />,
};

export const AIToolsPanel: React.FC<AIToolsPanelProps> = ({ onClose }) => {
  const { pages, activePageId, saveToHistory, updateBlock } = useEditorStore();

  // Config state
  const [industry, setIndustry] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [siteTopic, setSiteTopic] = useState('');
  const [language, setLanguage] = useState<ContentLanguage>('en');

  // Pipeline state
  const [activeSteps, setActiveSteps] = useState<Set<PipelineStep>>(new Set(['design', 'content', 'seo', 'smm']));
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<PipelineStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<PipelineStep>>(new Set());
  const [results, setResults] = useState<AIPipelineResult | null>(null);
  const [tab, setTab] = useState<Tab>('config');

  const industries = getIndustries();
  const categories = industry ? getCategoriesByIndustry(industry) : [];
  const subServices = industry && serviceCategory ? getSubServices(industry, serviceCategory) : [];

  const toggleStep = (step: PipelineStep) => {
    setActiveSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) next.delete(step);
      else next.add(step);
      return next;
    });
  };

  const canRun = industry && serviceCategory && targetCity && activeSteps.size > 0;

  const buildContext = useCallback((): AIContext => ({
    pages,
    activePageId,
    siteTopic: siteTopic || `${serviceCategory} in ${targetCity}`,
    targetCity,
    serviceCategory,
    industry,
    subServices,
    language,
  }), [pages, activePageId, siteTopic, targetCity, serviceCategory, industry, subServices, language]);

  const applyDesignToBlocks = useCallback((result: AIPipelineResult) => {
    if (!result.design) return;
    const { theme } = result.design;
    const activePage = pages.find((p) => p.id === activePageId);
    if (!activePage) return;

    saveToHistory();
    for (const block of activePage.blocks) {
      updateBlock(block.id, {
        backgroundColor: theme.colors.background,
        textColor: theme.colors.text,
        fontFamily: theme.fonts.body,
      });
    }
  }, [pages, activePageId, saveToHistory, updateBlock]);

  const applyContentToBlocks = useCallback((result: AIPipelineResult) => {
    if (!result.content) return;
    saveToHistory();
    for (const bc of result.content.blocks) {
      const text = [bc.headline, bc.subheadline, bc.description].filter(Boolean).join('\n\n');
      updateBlock(bc.blockId, { text });
    }
  }, [saveToHistory, updateBlock]);

  const runPipeline = useCallback(async () => {
    if (!canRun) return;
    setIsRunning(true);
    setCompletedSteps(new Set());
    setResults(null);

    const context = buildContext();
    const skeleton = analyzeSkeleton(context);
    console.log('AI Skeleton Analysis:', skeleton);

    try {
      const pipelineResult = await runAIPipeline(context, {
        steps: Array.from(activeSteps),
        onStepStart: (step) => setCurrentStep(step),
        onStepComplete: (step) => {
          setCurrentStep(null);
          setCompletedSteps((prev) => new Set([...prev, step]));
        },
      });

      setResults(pipelineResult);
      setTab('results');
    } catch (err) {
      console.error('AI Pipeline error:', err);
    } finally {
      setIsRunning(false);
      setCurrentStep(null);
    }
  }, [canRun, buildContext, activeSteps]);

  const applyResults = useCallback(() => {
    if (!results) return;
    applyDesignToBlocks(results);
    applyContentToBlocks(results);
  }, [results, applyDesignToBlocks, applyContentToBlocks]);

  return (
    <div className="fixed top-14 right-0 w-96 h-[calc(100vh-3.5rem)] bg-card border-l border-border shadow-xl z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="font-semibold text-sm text-foreground">AI Tools</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-secondary text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setTab('config')}
          className={cn('flex-1 py-2 text-xs font-medium transition-colors',
            tab === 'config' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Configuration
        </button>
        <button
          onClick={() => setTab('results')}
          disabled={!results}
          className={cn('flex-1 py-2 text-xs font-medium transition-colors',
            tab === 'results' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground',
            !results && 'opacity-40 cursor-not-allowed'
          )}
        >
          Results
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'config' ? (
          <div className="p-4 space-y-4">
            {/* Language */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Language</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(Object.entries(LANGUAGE_LABELS) as [ContentLanguage, string][]).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => setLanguage(code)}
                    className={cn(
                      'px-2.5 py-1 rounded text-xs font-medium transition-colors',
                      language === code ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Industry</label>
              <SelectField value={industry} onChange={(v) => { setIndustry(v); setServiceCategory(''); }} options={industries} placeholder="Select industry" />
            </div>

            {/* Service Category */}
            {industry && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Service Category</label>
                <SelectField value={serviceCategory} onChange={setServiceCategory} options={categories} placeholder="Select category" />
              </div>
            )}

            {/* Sub-services display */}
            {subServices.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Sub-services</label>
                <div className="flex flex-wrap gap-1">
                  {subServices.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-secondary rounded text-xs text-secondary-foreground">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Target City */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Target City</label>
              <input
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                placeholder="e.g. Berlin"
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Site Topic (optional) */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Site Topic <span className="text-muted-foreground">(optional)</span></label>
              <input
                value={siteTopic}
                onChange={(e) => setSiteTopic(e.target.value)}
                placeholder="Auto-generated from category + city"
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-4">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">AI Modules</label>
              <div className="space-y-2">
                {(['design', 'content', 'seo', 'smm'] as PipelineStep[]).map((step) => (
                  <button
                    key={step}
                    onClick={() => toggleStep(step)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                      activeSteps.has(step)
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'bg-secondary text-muted-foreground border border-transparent hover:bg-muted'
                    )}
                  >
                    {STEP_ICONS[step]}
                    <span className="flex-1">{STEP_LABELS[step]}</span>
                    {completedSteps.has(step) && <Check className="w-4 h-4 text-success" />}
                    {currentStep === step && <Loader2 className="w-4 h-4 animate-spin" />}
                    <div className={cn(
                      'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                      activeSteps.has(step) ? 'bg-accent border-accent' : 'border-muted-foreground/30'
                    )}>
                      {activeSteps.has(step) && <Check className="w-3 h-3 text-accent-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Run buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={runPipeline}
                disabled={!canRun || isRunning}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-colors',
                  canRun && !isRunning
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running{currentStep ? `: ${STEP_LABELS[currentStep]}` : '...'}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    AI Optimize Website
                  </>
                )}
              </button>

              {!canRun && !isRunning && (
                <p className="text-xs text-muted-foreground text-center">
                  Select industry, category, city, and at least one module
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Results tab */
          <div className="p-4 space-y-4">
            {results && (
              <>
                {/* Apply button */}
                <button
                  onClick={applyResults}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Apply Design & Content to Blocks
                </button>

                {/* Design result */}
                {results.design && (
                  <ResultSection title="Design Theme" icon={<Palette className="w-4 h-4" />}>
                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        {Object.entries(results.design.theme.colors).map(([key, color]) => (
                          <div key={key} className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-md border border-border" style={{ backgroundColor: color }} />
                            <span className="text-[10px] text-muted-foreground">{key}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Fonts: {results.design.theme.fonts.heading} / {results.design.theme.fonts.body}
                      </p>
                    </div>
                  </ResultSection>
                )}

                {/* Content result */}
                {results.content && (
                  <ResultSection title={`Content (${results.content.blocks.length} blocks)`} icon={<FileText className="w-4 h-4" />}>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {results.content.blocks.map((bc) => (
                        <div key={bc.blockId} className="p-2 bg-secondary rounded text-xs">
                          <span className="font-medium text-foreground">{bc.blockType}</span>
                          <span className="text-muted-foreground ml-1">— {bc.headline}</span>
                        </div>
                      ))}
                    </div>
                  </ResultSection>
                )}

                {/* SEO result */}
                {results.seo && (
                  <ResultSection title={`SEO Pages (${results.seo.pages.length})`} icon={<Search className="w-4 h-4" />}>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {results.seo.pages.map((page: SEOPage) => (
                        <div key={page.slug} className="p-2 bg-secondary rounded text-xs">
                          <p className="font-medium text-foreground">{page.title}</p>
                          <p className="text-muted-foreground mt-0.5">/{page.slug}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>
                )}

                {/* SMM result */}
                {results.smm && (
                  <ResultSection title={`Social Posts (${results.smm.posts.length})`} icon={<Share2 className="w-4 h-4" />}>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {results.smm.posts.map((post: SMMPost, i: number) => (
                        <div key={i} className="p-2 bg-secondary rounded text-xs">
                          <span className="font-medium text-foreground capitalize">{post.platform}</span>
                          <p className="text-muted-foreground mt-0.5 line-clamp-2">{post.caption}</p>
                        </div>
                      ))}
                    </div>
                  </ResultSection>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Helper Components ────────────────────────────────────

const SelectField: React.FC<{
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
  </div>
);

const ResultSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="border border-border rounded-lg overflow-hidden">
    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border">
      {icon}
      <span className="text-xs font-medium text-foreground">{title}</span>
    </div>
    <div className="p-3">{children}</div>
  </div>
);
