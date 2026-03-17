import type { SEOPage, SMMPost } from './types';

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportSEOAsJSON(pages: SEOPage[]) {
  downloadFile(JSON.stringify(pages, null, 2), 'seo-pages.json', 'application/json');
}

export function exportSEOAsHTML(pages: SEOPage[]) {
  const html = pages.map((page) => {
    const headingsHtml = page.headings
      .map((h) => `<h${h.level}>${h.text}</h${h.level}>`)
      .join('\n    ');

    const faqHtml = page.faq
      .map(
        (f) => `
    <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${f.question}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">${f.answer}</p>
      </div>
    </div>`
      )
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.metaDescription}">
  <link rel="canonical" href="/${page.slug}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; line-height: 1.6; color: #1a1a2e; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
    h2 { font-size: 1.5rem; margin: 2rem 0 0.75rem; }
    h3 { font-size: 1.2rem; margin: 1.5rem 0 0.5rem; }
    p { margin-bottom: 1rem; }
    .faq-item { border-bottom: 1px solid #eee; padding: 1rem 0; }
    .faq-item h3 { margin: 0 0 0.5rem; }
    .faq-item p { margin: 0; color: #555; }
  </style>
</head>
<body itemscope itemtype="https://schema.org/FAQPage">
  <h1>${page.h1}</h1>
  <p>${page.bodyContent}</p>
  ${headingsHtml}
  <section>
    <h2>FAQ</h2>
    ${faqHtml}
  </section>
</body>
</html>`;
  }).join('\n\n<!-- ═══ PAGE SEPARATOR ═══ -->\n\n');

  downloadFile(html, 'seo-pages.html', 'text/html');
}

export function exportSMMAsJSON(posts: SMMPost[]) {
  downloadFile(JSON.stringify(posts, null, 2), 'smm-posts.json', 'application/json');
}

export function exportSMMAsCSV(posts: SMMPost[]) {
  const header = 'Platform,Caption,Hashtags,Image Prompt';
  const rows = posts.map((p) => {
    const caption = `"${p.caption.replace(/"/g, '""')}"`;
    const hashtags = `"${p.hashtags.join(' ')}"`;
    const prompt = p.suggestedImagePrompt ? `"${p.suggestedImagePrompt}"` : '';
    return `${p.platform},${caption},${hashtags},${prompt}`;
  });
  downloadFile([header, ...rows].join('\n'), 'smm-posts.csv', 'text/csv');
}
