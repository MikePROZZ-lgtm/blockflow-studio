import React, { useState, useCallback } from 'react';
import {
  Sparkles, Palette, FileText, Search, Share2, Zap,
  ChevronDown, Check, Loader2, X, Globe, Download,
  Eye, Copy, Instagram, Linkedin, Facebook,
} from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';
import { getIndustries, getCategoriesByIndustry, getSubServices } from '@/ai/taxonomy';
import { runAIPipeline, analyzeSkeleton, type PipelineStep } from '@/ai/orchestrator';
import type { AIContext, AIPipelineResult, ContentLanguage, SEOPage, SMMPost } from '@/ai/types';
import { LANGUAGE_LABELS } from '@/ai/types';
import { exportSEOAsJSON, exportSEOAsHTML, exportSMMAsJSON, exportSMMAsCSV } from '@/ai/export';
import { SEOPreviewModal } from './SEOPreviewModal';

interface AIToolsPanelProps {
  onClose: () => void;
}

type Tab = 'config' | 'design' | 'content' | 'seo' | 'smm';

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

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-3.5 h-3.5" />,
  facebook: <Facebook className="w-3.5 h-3.5" />,
  linkedin: <Linkedin className="w-3.5 h-3.5" />,
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'bg-gradient-to-r from-[hsl(330,70%,50%)] to-[hsl(30,90%,55%)]',
  facebook: 'bg-[hsl(220,70%,50%)]',
  linkedin: 'bg-[hsl(210,80%,40%)]',
};

export const AIToolsPanel: React.FC<AIToolsPanelProps> = ({ onClose }) => {
  const { pages, activePageId, saveToHistory, updateBlock } = useEditorStore();

  // Config
  const [industry, setIndustry] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [targetCity, setTargetCity] = useState('');
  const [siteTopic, setSiteTopic] = useState('');
  const [language, setLanguage] = useState<ContentLanguage>('en');

  // Pipeline
  const [activeSteps, setActiveSteps] = useState<Set<PipelineStep>>(new Set(['design', 'content', 'seo', 'smm']));
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<PipelineStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<PipelineStep>>(new Set());
  const [results, setResults] = useState<AIPipelineResult | null>(null);
  const [tab, setTab] = useState<Tab>('config');
  const [showSEOPreview, setShowSEOPreview] = useState(false);
  const [copiedPost, setCopiedPost] = useState<number | null>(null);

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
    pages, activePageId,
    siteTopic: siteTopic || `${serviceCategory} in ${targetCity}`,
    targetCity, serviceCategory, industry, subServices, language,
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
      // Switch to first available result tab
      if (pipelineResult.design) setTab('design');
      else if (pipelineResult.content) setTab('content');
      else if (pipelineResult.seo) setTab('seo');
      else if (pipelineResult.smm) setTab('smm');
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

  const copyPostCaption = (post: SMMPost, index: number) => {
    navigator.clipboard.writeText(post.caption + '\n\n' + post.hashtags.join(' '));
    setCopiedPost(index);
    setTimeout(() => setCopiedPost(null), 1500);
  };

  const resultTabs: { key: Tab; label: string; icon: React.ReactNode; available: boolean }[] = [
    { key: 'design', label: 'Design', icon: <Palette className="w-3.5 h-3.5" />, available: !!results?.design },
    { key: 'content', label: 'Content', icon: <FileText className="w-3.5 h-3.5" />, available: !!results?.content },
    { key: 'seo', label: 'SEO', icon: <Search className="w-3.5 h-3.5" />, available: !!results?.seo },
    { key: 'smm', label: 'SMM', icon: <Share2 className="w-3.5 h-3.5" />, available: !!results?.smm },
  ];

  const hasResults = results && (results.design || results.content || results.seo || results.smm);

  return (
    <>
      <div className="fixed top-14 right-0 w-[420px] h-[calc(100vh-3.5rem)] bg-card border-l border-border shadow-xl z-50 flex flex-col animate-fade-in">
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
        <div className="flex border-b border-border overflow-x-auto">
          <button
            onClick={() => setTab('config')}
            className={cn(
              'px-4 py-2.5 text-xs font-medium transition-colors whitespace-nowrap',
              tab === 'config' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            ⚙ Config
          </button>
          {resultTabs.map((rt) => (
            <button
              key={rt.key}
              onClick={() => rt.available && setTab(rt.key)}
              disabled={!rt.available}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap',
                tab === rt.key ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground',
                !rt.available && 'opacity-30 cursor-not-allowed'
              )}
            >
              {rt.icon}
              {rt.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'config' && (
            <div className="p-4 space-y-4">
              {/* Language */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Language</label>
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
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Industry</label>
                <SelectField value={industry} onChange={(v) => { setIndustry(v); setServiceCategory(''); }} options={industries} placeholder="Select industry" />
              </div>

              {/* Category */}
              {industry && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Service Category</label>
                  <SelectField value={serviceCategory} onChange={setServiceCategory} options={categories} placeholder="Select category" />
                </div>
              )}

              {/* Sub-services */}
              {subServices.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Sub-services</label>
                  <div className="flex flex-wrap gap-1">
                    {subServices.map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* City */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Target City</label>
                <input
                  value={targetCity}
                  onChange={(e) => setTargetCity(e.target.value)}
                  placeholder="e.g. Berlin"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Site Topic <span className="text-muted-foreground">(optional)</span>
                </label>
                <input
                  value={siteTopic}
                  onChange={(e) => setSiteTopic(e.target.value)}
                  placeholder="Auto-generated from category + city"
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Modules */}
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
                      {completedSteps.has(step) && <Check className="w-4 h-4 text-[hsl(var(--success))]" />}
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

              {/* Run */}
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
          )}

          {/* ─── Design Tab ─────────────────────── */}
          {tab === 'design' && results?.design && (
            <div className="p-4 space-y-4">
              <ActionBar onApply={applyResults} applyLabel="Apply Design & Content" />

              {/* Color palette */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="text-xs font-semibold text-foreground mb-3">Color Palette</h4>
                <div className="flex gap-2">
                  {Object.entries(results.design.theme.colors).map(([key, color]) => (
                    <div key={key} className="flex flex-col items-center gap-1.5 flex-1">
                      <div
                        className="w-full aspect-square rounded-lg border border-border shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[10px] font-medium text-muted-foreground capitalize">{key}</span>
                      <span className="text-[9px] text-muted-foreground font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="text-xs font-semibold text-foreground mb-3">Typography</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary rounded-lg">
                    <span className="text-[10px] text-muted-foreground block mb-1">Heading</span>
                    <span className="text-sm font-bold text-foreground">{results.design.theme.fonts.heading}</span>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <span className="text-[10px] text-muted-foreground block mb-1">Body</span>
                    <span className="text-sm text-foreground">{results.design.theme.fonts.body}</span>
                  </div>
                </div>
              </div>

              {/* Button style */}
              <div className="border border-border rounded-lg p-4">
                <h4 className="text-xs font-semibold text-foreground mb-3">Button Style</h4>
                <div className="flex items-center gap-4">
                  <div
                    className="px-5 py-2 text-sm font-medium text-white"
                    style={{
                      backgroundColor: results.design.theme.colors.primary,
                      borderRadius: results.design.theme.buttonStyle.radius,
                    }}
                  >
                    Sample Button
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Radius: {results.design.theme.buttonStyle.radius}</p>
                    <p>Hover: {results.design.theme.buttonStyle.hoverEffect}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Content Tab ────────────────────── */}
          {tab === 'content' && results?.content && (
            <div className="p-4 space-y-4">
              <ActionBar onApply={applyResults} applyLabel="Apply Content to Blocks" />

              <div className="space-y-2">
                {results.content.blocks.map((bc) => (
                  <div key={bc.blockId} className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border">
                      <span className="px-2 py-0.5 bg-accent/15 text-accent text-[10px] font-semibold rounded-full uppercase">
                        {bc.blockType}
                      </span>
                      <span className="text-xs text-muted-foreground">{bc.page}</span>
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-sm font-semibold text-foreground">{bc.headline}</p>
                      <p className="text-xs text-muted-foreground">{bc.subheadline}</p>
                      <p className="text-xs text-muted-foreground/80 line-clamp-2 mt-1">{bc.description}</p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded-full">
                        {bc.cta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── SEO Tab ────────────────────────── */}
          {tab === 'seo' && results?.seo && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSEOPreview(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview Pages
                </button>
                <button
                  onClick={() => exportSEOAsJSON(results.seo!.pages)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  JSON
                </button>
                <button
                  onClick={() => exportSEOAsHTML(results.seo!.pages)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  HTML
                </button>
              </div>

              <div className="space-y-2">
                {results.seo.pages.map((page: SEOPage) => (
                  <div key={page.slug} className="border border-border rounded-lg p-3">
                    <p className="text-sm font-semibold text-foreground">{page.title}</p>
                    <p className="text-xs text-accent font-mono mt-0.5">/{page.slug}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{page.metaDescription}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-muted-foreground">
                        {page.headings.length} headings
                      </span>
                      <span className="text-[10px] text-muted-foreground">•</span>
                      <span className="text-[10px] text-muted-foreground">
                        {page.faq.length} FAQ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── SMM Tab ────────────────────────── */}
          {tab === 'smm' && results?.smm && (
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportSMMAsJSON(results.smm!.posts)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  JSON
                </button>
                <button
                  onClick={() => exportSMMAsCSV(results.smm!.posts)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </button>
              </div>

              <div className="space-y-3">
                {results.smm.posts.map((post: SMMPost, i: number) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                      <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-white', PLATFORM_COLORS[post.platform])}>
                        {PLATFORM_ICONS[post.platform]}
                      </div>
                      <span className="text-xs font-semibold text-foreground capitalize">{post.platform}</span>
                      <div className="flex-1" />
                      <button
                        onClick={() => copyPostCaption(post, i)}
                        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-smooth"
                        title="Copy caption"
                      >
                        {copiedPost === i ? <Check className="w-3.5 h-3.5 text-[hsl(var(--success))]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-foreground whitespace-pre-line leading-relaxed">{post.caption}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.hashtags.slice(0, 5).map((tag) => (
                          <span key={tag} className="text-[10px] text-primary font-medium">{tag}</span>
                        ))}
                        {post.hashtags.length > 5 && (
                          <span className="text-[10px] text-muted-foreground">+{post.hashtags.length - 5}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Preview Modal */}
      {showSEOPreview && results?.seo && (
        <SEOPreviewModal pages={results.seo.pages} onClose={() => setShowSEOPreview(false)} />
      )}
    </>
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

const ActionBar: React.FC<{
  onApply: () => void;
  applyLabel: string;
}> = ({ onApply, applyLabel }) => (
  <button
    onClick={onApply}
    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-colors"
  >
    <Check className="w-4 h-4" />
    {applyLabel}
  </button>
);
