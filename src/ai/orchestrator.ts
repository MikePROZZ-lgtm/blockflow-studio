import type { AIContext, AIPipelineResult } from './types';
import { aiDesignModule } from './modules/ai-design';
import { aiContentModule } from './modules/ai-content';
import { aiSEOModule } from './modules/ai-seo';
import { aiSMMModule } from './modules/ai-smm';

export type PipelineStep = 'design' | 'content' | 'seo' | 'smm';

export interface PipelineOptions {
  steps: PipelineStep[];
  onStepStart?: (step: PipelineStep) => void;
  onStepComplete?: (step: PipelineStep) => void;
}

export async function runAIPipeline(
  context: AIContext,
  options: PipelineOptions
): Promise<AIPipelineResult> {
  const result: AIPipelineResult = {};

  for (const step of options.steps) {
    options.onStepStart?.(step);

    switch (step) {
      case 'design':
        result.design = await aiDesignModule.run(context);
        break;
      case 'content':
        result.content = await aiContentModule.run(context);
        break;
      case 'seo':
        result.seo = await aiSEOModule.run(context);
        break;
      case 'smm':
        result.smm = await aiSMMModule.run(context);
        break;
    }

    options.onStepComplete?.(step);
  }

  return result;
}

export function analyzeSkeleton(context: AIContext) {
  const stats = {
    totalPages: context.pages.length,
    totalBlocks: context.pages.reduce((sum, p) => sum + p.blocks.length, 0),
    pagesWithContent: context.pages.filter((p) =>
      p.blocks.some((b) => b.text.trim().length > 0)
    ).length,
  };
  return stats;
}
