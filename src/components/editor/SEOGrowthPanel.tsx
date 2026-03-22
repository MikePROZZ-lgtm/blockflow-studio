import React, { useState, useMemo } from 'react';
import {
  X, Globe, MapPin, Rocket, ChevronRight, ChevronDown,
  TrendingUp, AlertTriangle, CheckCircle2, FileText,
  Search, Link2, BarChart3, Download, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getIndustries, getCategoriesByIndustry, getServicesByCategory, type ServiceEntry, type IndustryEntry } from '@/data/serviceTaxonomy';
import { getCountries, getCitiesByCountry, type City } from '@/data/geoDatabase';
import { generateSEOPages, estimatePageCount } from '@/seo/pageGenerator';
import { analyzePages, getGrowthSummary } from '@/ai/modules/ai-growth';
import { buildLinkMap, getLinkStats } from '@/seo/internalLinking';
import type { SEOGeneratedPage, PageGenerationConfig, GrowthRecommendation } from '@/seo/types';

interface SEOGrowthPanelProps {
  onClose: () => void;
}

type Tab = 'config' | 'pages' | 'growth' | 'links';

export const SEOGrowthPanel: React.FC<SEOGrowthPanelProps> = ({ onClose }) => {
  // Config state
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedIntents, setSelectedIntents] = useState<string[]>(['emergency']);
  const [pageLimit, setPageLimit] = useState<number>(50);

  // Results state
  const [generatedPages, setGeneratedPages] = useState<SEOGeneratedPage[]>([]);
  const [recommendations, setRecommendations] = useState<GrowthRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const [expandedPage, setExpandedPage] = useState<string | null>(null);

  // Derived data
  const industries = useMemo(() => getIndustries(), []);
  const categories = useMemo(() => selectedIndustry ? getCategoriesByIndustry(selectedIndustry) : [], [selectedIndustry]);
  const services = useMemo(() => selectedIndustry && selectedCategory ? getServicesByCategory(selectedIndustry, selectedCategory) : [], [selectedIndustry, selectedCategory]);
  const countries = useMemo(() => getCountries(), []);
  const cities = useMemo(() => selectedCountry ? getCitiesByCountry(selectedCountry) : [], [selectedCountry]);

  const currentService = useMemo(() => services.find((s) => s.slug === selectedService), [services, selectedService]);

  const availableIntents = ['emergency', 'cheap', '24-7'];

  const estimatedCount = useMemo(() => {
    if (!currentService || selectedCities.length === 0) return 0;
    const config = buildConfig();
    return config ? estimatePageCount(config) : 0;
  }, [currentService, selectedCities, selectedIntents, pageLimit]);

  function buildConfig(): PageGenerationConfig | null {
    if (!currentService || selectedCities.length === 0) return null;
    const industry = industries.find((i) => i.slug === selectedIndustry);
    const category = categories.find((c) => c.slug === selectedCategory);
    if (!industry || !category) return null;

    const selectedCityObjects = cities.filter((c) => selectedCities.includes(c.slug));
    return {
      serviceSlug: currentService.slug,
      serviceName: currentService.name,
      categoryName: category.name,
      industryName: industry.name,
      keywords: currentService.keywords,
      commonPhrases: currentService.commonPhrases,
      ctaPatterns: currentService.ctaPatterns,
      subServiceNames: currentService.subServices.map((s) => s.name),
      cities: selectedCityObjects.map((c) => ({
        name: c.name,
        slug: c.slug,
        districts: c.districts,
      })),
      intents: selectedIntents,
      limit: pageLimit,
    };
  }

  async function handleGenerate() {
    const config = buildConfig();
    if (!config) return;
    setIsGenerating(true);
    // Small delay for UX
    await new Promise((r) => setTimeout(r, 500));
    const pages = generateSEOPages(config);
    const recs = analyzePages(pages);
    setGeneratedPages(pages);
    setRecommendations(recs);
    setIsGenerating(false);
    setActiveTab('pages');
  }

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(generatedPages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-pages.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleCity(slug: string) {
    setSelectedCities((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function toggleIntent(intent: string) {
    setSelectedIntents((prev) =>
      prev.includes(intent) ? prev.filter((i) => i !== intent) : [...prev, intent]
    );
  }

  const linkMap = useMemo(() => generatedPages.length > 0 ? buildLinkMap(generatedPages) : {}, [generatedPages]);
  const linkStats = useMemo(() => generatedPages.length > 0 ? getLinkStats(generatedPages, linkMap) : null, [generatedPages, linkMap]);
  const growthSummary = useMemo(() => generatedPages.length > 0 ? getGrowthSummary(generatedPages, recommendations) : null, [generatedPages, recommendations]);

  const TABS: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'config', label: 'Configure', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'pages', label: 'Pages', icon: <FileText className="w-3.5 h-3.5" />, count: generatedPages.length },
    { id: 'growth', label: 'Growth', icon: <TrendingUp className="w-3.5 h-3.5" />, count: recommendations.length },
    { id: 'links', label: 'Links', icon: <Link2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-[520px] max-h-[80vh] bg-card border border-border rounded-xl shadow-xl z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-sm">SEO Growth Engine</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-secondary transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'config' && (
          <>
            {/* Industry */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => { setSelectedIndustry(e.target.value); setSelectedCategory(''); setSelectedService(''); }}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              >
                <option value="">Select industry...</option>
                {industries.map((ind) => (
                  <option key={ind.slug} value={ind.slug}>{ind.name}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setSelectedService(''); }}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Service */}
            {services.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
                >
                  <option value="">Select service...</option>
                  {services.map((svc) => (
                    <option key={svc.slug} value={svc.slug}>{svc.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sub-services preview */}
            {currentService && currentService.subServices.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Sub-services (auto-included)</label>
                <div className="flex flex-wrap gap-1.5">
                  {currentService.subServices.map((sub) => (
                    <span key={sub.slug} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-border pt-4" />

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCities([]); }}
                className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm"
              >
                <option value="">Select country...</option>
                {countries.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Cities */}
            {cities.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Cities ({selectedCities.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {cities.map((city) => (
                    <button
                      key={city.slug}
                      onClick={() => toggleCity(city.slug)}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-lg border transition-colors text-left',
                        selectedCities.includes(city.slug)
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-secondary border-border text-foreground hover:bg-muted'
                      )}
                    >
                      {city.name}
                      {city.population && (
                        <span className="text-muted-foreground ml-1">({(city.population / 1000).toFixed(0)}k)</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Intents */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Search Intents</label>
              <div className="flex flex-wrap gap-1.5">
                {availableIntents.map((intent) => (
                  <button
                    key={intent}
                    onClick={() => toggleIntent(intent)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg border transition-colors capitalize',
                      selectedIntents.includes(intent)
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>

            {/* Page limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Page Limit</label>
              <div className="flex gap-2">
                {[10, 50, 100, 500, 1000].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPageLimit(n)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                      pageLimit === n
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimate */}
            {estimatedCount > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <span className="font-medium">Estimated: {estimatedCount} pages</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCities.length} cities × {currentService?.subServices.length ?? 0} sub-services + {selectedIntents.length} intents
                </p>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!currentService || selectedCities.length === 0 || isGenerating}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Generate {estimatedCount > 0 ? `${Math.min(estimatedCount, pageLimit)} SEO Pages` : 'SEO Pages'}
                </>
              )}
            </button>
          </>
        )}

        {activeTab === 'pages' && (
          <>
            {generatedPages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                No pages generated yet. Configure and generate first.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{generatedPages.length} pages generated</span>
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary rounded-lg hover:bg-muted transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Export JSON
                  </button>
                </div>
                <div className="space-y-1.5">
                  {generatedPages.map((page) => (
                    <div key={page.id} className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-secondary/50 transition-colors"
                      >
                        {expandedPage === page.id ? (
                          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">/{page.slug}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{page.title}</div>
                        </div>
                        <div className="flex gap-1">
                          {page.meta.intent && (
                            <span className="px-1.5 py-0.5 bg-accent/10 text-accent-foreground rounded text-[10px]">
                              {page.meta.intent}
                            </span>
                          )}
                          {page.meta.district && (
                            <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px]">
                              {page.meta.district}
                            </span>
                          )}
                        </div>
                      </button>
                      {expandedPage === page.id && (
                        <div className="px-3 pb-3 space-y-2 border-t border-border bg-secondary/30">
                          <div className="pt-2">
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Title</div>
                            <div className="text-xs">{page.title}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Meta Description</div>
                            <div className="text-xs">{page.metaDescription}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">H1</div>
                            <div className="text-xs font-medium">{page.h1}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Content Preview</div>
                            <div className="text-xs text-muted-foreground">{page.bodyContent.substring(0, 200)}...</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">FAQ ({page.faq.length})</div>
                            {page.faq.map((f, i) => (
                              <div key={i} className="text-xs mt-1">
                                <div className="font-medium">Q: {f.question}</div>
                                <div className="text-muted-foreground">A: {f.answer}</div>
                              </div>
                            ))}
                          </div>
                          {page.internalLinks.length > 0 && (
                            <div>
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Internal Links ({page.internalLinks.length})</div>
                              {page.internalLinks.map((link, i) => (
                                <div key={i} className="text-xs text-primary">→ /{link.slug}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'growth' && (
          <>
            {growthSummary && (
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-red-500/10 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-red-500">{growthSummary.highPriority}</div>
                  <div className="text-[10px] text-muted-foreground">High</div>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-yellow-500">{growthSummary.mediumPriority}</div>
                  <div className="text-[10px] text-muted-foreground">Medium</div>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-500">{growthSummary.lowPriority}</div>
                  <div className="text-[10px] text-muted-foreground">Low</div>
                </div>
              </div>
            )}
            {recommendations.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                Generate pages first to see growth recommendations.
              </div>
            ) : (
              <div className="space-y-2">
                {recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-lg border p-3 space-y-1',
                      rec.priority === 'high' ? 'border-red-500/30 bg-red-500/5' :
                      rec.priority === 'medium' ? 'border-yellow-500/30 bg-yellow-500/5' :
                      'border-green-500/30 bg-green-500/5'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn(
                        'w-3.5 h-3.5',
                        rec.priority === 'high' ? 'text-red-500' :
                        rec.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                      )} />
                      <span className="text-xs font-medium">{rec.issue}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{rec.suggestion}</div>
                    <div className="text-[10px] text-muted-foreground">Page: /{rec.pageSlug}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'links' && (
          <>
            {linkStats ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{linkStats.totalLinks}</div>
                    <div className="text-[10px] text-muted-foreground">Total Links</div>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{linkStats.averageLinksPerPage}</div>
                    <div className="text-[10px] text-muted-foreground">Avg Links/Page</div>
                  </div>
                  <div className="bg-secondary rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-foreground">{linkStats.totalPages}</div>
                    <div className="text-[10px] text-muted-foreground">Total Pages</div>
                  </div>
                  <div className={cn(
                    'rounded-lg p-3 text-center',
                    linkStats.orphanPages > 0 ? 'bg-red-500/10' : 'bg-green-500/10'
                  )}>
                    <div className={cn('text-lg font-bold', linkStats.orphanPages > 0 ? 'text-red-500' : 'text-green-500')}>
                      {linkStats.orphanPages}
                    </div>
                    <div className="text-[10px] text-muted-foreground">Orphan Pages</div>
                  </div>
                </div>
                {linkStats.orphanPages === 0 && generatedPages.length > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-700">All pages are connected with internal links.</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                Generate pages first to see link analysis.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
