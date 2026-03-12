import type { AIContext, AISMMResult, AIModule, SMMPost } from '../types';

function generatePosts(ctx: AIContext): SMMPost[] {
  const { serviceCategory, targetCity, subServices, industry } = ctx;
  const cat = serviceCategory.toLowerCase();

  const baseHashtags = [
    `#${serviceCategory.replace(/\s+/g, '')}`,
    `#${targetCity.replace(/\s+/g, '')}`,
    `#${industry.replace(/\s+/g, '')}`,
    '#LocalBusiness',
    '#QualityService',
  ];

  return [
    {
      platform: 'instagram',
      caption: `🔧 Need a reliable ${cat} in ${targetCity}? We've got you covered! Professional service, fair prices, and fast response times. Book today! 💪\n\nDM us or call for a free quote.`,
      hashtags: [...baseHashtags, '#InstaService', '#HomeImprovement', `#${targetCity}Life`],
      suggestedImagePrompt: `Professional ${cat} at work in a modern ${targetCity} home, clean photography style`,
    },
    {
      platform: 'instagram',
      caption: `✅ Just completed another ${subServices[0]?.toLowerCase() ?? cat} project in ${targetCity}! Another happy customer. Swipe to see the before & after 👉\n\n📞 Your turn — free estimates available!`,
      hashtags: [...baseHashtags, '#BeforeAndAfter', '#TransformationTuesday', '#ProResults'],
      suggestedImagePrompt: `Before and after ${cat} project, split image, professional quality`,
    },
    {
      platform: 'facebook',
      caption: `Looking for trusted ${cat} services in ${targetCity}? 🏠\n\nWe offer:\n${subServices.slice(0, 4).map((s) => `✅ ${s}`).join('\n')}\n\n🕐 Available 24/7 for emergencies\n💰 Free estimates — no hidden fees\n\nCall us today or send a message to book your appointment!`,
      hashtags: [...baseHashtags, '#FacebookLocal'],
    },
    {
      platform: 'facebook',
      caption: `⭐⭐⭐⭐⭐\n\n"Best ${cat} in ${targetCity}! Fast, professional, and honest pricing. Highly recommend!" — Recent Customer\n\nThank you for trusting us with your ${industry.toLowerCase()} needs! We're proud to serve the ${targetCity} community.\n\n📞 Contact us for your next project.`,
      hashtags: [...baseHashtags, '#5StarReview', '#CustomerLove'],
    },
    {
      platform: 'linkedin',
      caption: `Proud to share that our ${serviceCategory} team continues to grow in ${targetCity}. 🚀\n\nThis quarter we've:\n📈 Served 50+ new clients\n🏆 Maintained a 4.9★ rating\n👥 Expanded our certified team\n\nAs ${targetCity}'s leading ${cat} provider, we're committed to setting the industry standard for quality and reliability.\n\n#Growth #${serviceCategory.replace(/\s+/g, '')} #${targetCity}`,
      hashtags: [...baseHashtags, '#BusinessGrowth', '#TeamExpansion', '#IndustryLeader'],
    },
    {
      platform: 'linkedin',
      caption: `💡 ${serviceCategory} Tip for ${targetCity} Businesses:\n\nRegular maintenance can save you up to 40% on emergency repair costs. Our commercial ${cat} program includes scheduled inspections and priority emergency response.\n\nInterested? Let's connect.\n\n#CommercialServices #PreventiveMaintenance`,
      hashtags: [...baseHashtags, '#BusinessTips', '#CommercialProperty'],
    },
  ];
}

export const aiSMMModule: AIModule<AISMMResult> = {
  name: 'AI SMM',
  run: async (context: AIContext): Promise<AISMMResult> => {
    await new Promise((r) => setTimeout(r, 700));
    return { posts: generatePosts(context) };
  },
};
