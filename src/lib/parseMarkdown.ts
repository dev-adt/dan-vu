/**
 * parseMarkdownToHtml
 * Converts Markdown/text content to HTML for rendering in the browser.
 *
 * Rules:
 * - Block elements (headings, list items, images, alignments, captions) handle their own spacing.
 * - Regular text lines get a <br/> appended so single Enter is preserved as a new line.
 * - Empty lines produce a small spacer rather than a full double-spaced gap.
 */

type ParseSize = 'sm' | 'md';

interface ParseOptions {
  /** 'sm' for admin preview / homepage cards, 'md' for full article page */
  size?: ParseSize;
}

export function parseMarkdownToHtml(text: string, options: ParseOptions = {}): string {
  if (!text) return '';

  const { size = 'sm' } = options;

  // CSS class sets depending on context size
  const h1Cls  = size === 'md'
    ? 'font-heading font-extrabold text-3xl text-slate-900 leading-tight mt-6 mb-3'
    : 'font-heading font-extrabold text-xl text-slate-900 leading-snug mt-4 mb-2';
  const h2Cls  = size === 'md'
    ? 'font-heading font-bold text-2xl text-slate-900 mt-8 mb-3 border-b border-slate-200 pb-1'
    : 'font-heading font-bold text-lg text-primary mt-4 mb-1';
  const h3Cls  = size === 'md'
    ? 'font-heading font-semibold text-xl text-slate-800 mt-6 mb-2'
    : 'font-heading font-semibold text-base text-dark-obsidian mt-3 mb-1';
  const liCls  = size === 'md'
    ? 'text-base text-slate-700 list-disc ml-6 my-1 leading-relaxed'
    : 'text-xs text-dark-slate/90 list-disc ml-5 my-0.5';
  const imgCls = size === 'md'
    ? 'w-full h-auto rounded-2xl shadow-md border border-slate-200'
    : 'w-full h-auto rounded-xl shadow-sm max-w-lg border border-slate-200';
  const figCls = size === 'md' ? 'my-6 mx-auto max-w-2xl' : 'my-4';
  const capCls = size === 'md'
    ? 'text-xs text-slate-500 italic text-center mt-2 mb-4'
    : 'text-[11px] text-slate-500 italic text-center mt-1 mb-2';
  const alnCls = size === 'md' ? 'leading-relaxed my-2' : 'leading-relaxed my-1';

  // Raw image URL pattern
  const RAW_IMG_RE = /^(https?:\/\/[^\s'"]+(?:\.(?:jpeg|jpg|gif|png|webp|svg)|supabase\.co\/storage\/v1\/object\/public\/photos\/)[^\s'"]*)$/i;

  /** Apply inline transforms: links, images, bold, italic, color spans */
  const applyInline = (line: string): string => {
    // Inline images (mid-sentence) — wrap in figure
    line = line.replace(
      /!\[(.*?)\]\((.*?)\)/g,
      `<figure class="${figCls}"><img src="$2" alt="$1" class="${imgCls} block" /></figure>`,
    );
    // Links
    line = line.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-blue-600 underline hover:text-blue-800 font-semibold transition-colors" target="_blank" rel="noopener">$1</a>',
    );
    // Bold **text**
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    // Italic *text* (avoid matching **)
    line = line.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>');
    return line;
  };

  const lines = text.split('\n');
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // ── Empty line ──────────────────────────────────────────────────────────
    if (trimmed === '') {
      // Only add a small spacer if neither the previous nor next line is a block
      output.push('<div class="h-1"></div>');
      continue;
    }

    // ── Headings ────────────────────────────────────────────────────────────
    if (/^### /.test(trimmed)) {
      output.push(`<h3 class="${h3Cls}">${applyInline(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (/^## /.test(trimmed)) {
      output.push(`<h2 class="${h2Cls}">${applyInline(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (/^# /.test(trimmed)) {
      output.push(`<h1 class="${h1Cls}">${applyInline(trimmed.slice(2))}</h1>`);
      continue;
    }

    // ── List items ──────────────────────────────────────────────────────────
    if (/^\s*[-*]\s+/.test(raw)) {
      const content = applyInline(raw.replace(/^\s*[-*]\s+/, ''));
      output.push(`<li class="${liCls}">${content}</li>`);
      continue;
    }

    // ── Standalone image: ![alt](url) ───────────────────────────────────────
    const imgLineMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgLineMatch) {
      output.push(
        `<figure class="${figCls}"><img src="${imgLineMatch[2]}" alt="${imgLineMatch[1]}" class="${imgCls} block" /></figure>`,
      );
      continue;
    }

    // ── Caption line: _text_ (entire line wrapped in underscores) ───────────
    const capMatch = trimmed.match(/^_([^_]+)_$/);
    if (capMatch) {
      const captionContent = capMatch[1];
      // Attach figcaption inside previous <figure> if present
      const prev = output[output.length - 1] ?? '';
      if (prev.includes('<figure') && prev.includes('</figure>')) {
        output[output.length - 1] = prev.replace(
          '</figure>',
          `<figcaption class="${capCls}">${captionContent}</figcaption></figure>`,
        );
      } else {
        output.push(`<p class="${capCls}">${captionContent}</p>`);
      }
      continue;
    }

    // ── Raw image URL on its own line ────────────────────────────────────────
    if (RAW_IMG_RE.test(trimmed)) {
      output.push(
        `<figure class="${figCls}"><img src="${trimmed}" alt="Hình ảnh bài viết" class="${imgCls} block" /></figure>`,
      );
      continue;
    }

    // ── Alignment extensions ─────────────────────────────────────────────────
    if (/^->(.+?)<-$/.test(trimmed)) {
      const content = applyInline(trimmed.replace(/^->(.+?)<-$/, '$1').trim());
      output.push(`<p class="text-center ${alnCls}">${content}</p>`);
      continue;
    }
    if (/^>>/.test(trimmed)) {
      const content = applyInline(trimmed.slice(2).trim());
      output.push(`<p class="text-right ${alnCls}">${content}</p>`);
      continue;
    }
    if (/^<</.test(trimmed)) {
      const content = applyInline(trimmed.slice(2).trim());
      output.push(`<p class="text-left ${alnCls}">${content}</p>`);
      continue;
    }
    if (/^\|(.+)\|$/.test(trimmed)) {
      const content = applyInline(trimmed.replace(/^\|(.+)\|$/, '$1').trim());
      output.push(`<p class="text-justify ${alnCls}">${content}</p>`);
      continue;
    }

    // ── Regular text line → inline transforms + <br/> ───────────────────────
    output.push(applyInline(raw) + '<br/>');
  }

  return output.join('');
}
