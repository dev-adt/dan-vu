/**
 * Utility to parse various video URLs (YouTube, Vimeo, Google Drive, direct MP4, etc.)
 * and extract embed URLs and default thumbnails.
 */

export interface ParsedVideo {
  embedUrl: string;
  thumbnailUrl: string;
  type: 'youtube' | 'drive' | 'vimeo' | 'direct' | 'iframe';
}

export function parseVideoUrl(url: string, customThumbnail?: string): ParsedVideo {
  if (!url) {
    return {
      embedUrl: '',
      thumbnailUrl: customThumbnail || '',
      type: 'iframe',
    };
  }

  const cleanUrl = url.trim();

  // 1. YouTube
  // Formats: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: customThumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      type: 'youtube',
    };
  }

  // 2. Google Drive
  // Formats: drive.google.com/file/d/FILE_ID/view, drive.google.com/open?id=FILE_ID
  const driveMatch = cleanUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i) || cleanUrl.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      thumbnailUrl: customThumbnail || '',
      type: 'drive',
    };
  }

  // 3. Vimeo
  // Formats: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      thumbnailUrl: customThumbnail || '',
      type: 'vimeo',
    };
  }

  // 4. Direct video link (.mp4, .webm, .ogg)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(cleanUrl)) {
    return {
      embedUrl: cleanUrl,
      thumbnailUrl: customThumbnail || '',
      type: 'direct',
    };
  }

  // 5. Fallback iframe or raw link
  return {
    embedUrl: cleanUrl,
    thumbnailUrl: customThumbnail || '',
    type: 'iframe',
  };
}
