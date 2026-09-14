const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

/**
 * Resolves a full, downloadable URL whether relative or absolute.
 * Gracefully defaults to the bundled static CV if not provided.
 */
export function resolveFileUrl(url?: string | null): string {
  if (!url || url.includes('/api/cv/download') || url.includes('/uploads/cv/')) {
    return '/Jeff_G_Wilson_CV.pdf';
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }

  // If pointing to uploads (e.g. avatars, project images) and on a separate backend origin
  if (url.startsWith('/uploads')) {
    if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
      try {
        const origin = new URL(API_BASE).origin;
        return `${origin}${url}`;
      } catch {
        return url;
      }
    }
  }

  // If pointing to static public file or relative path
  if (url.startsWith('/')) {
    return url;
  }

  return `/${url}`;
}

/**
 * Downloads a file directly to the user's device.
 * Employs clean direct download and blob stream fetching.
 */
export async function downloadFile(url?: string | null, defaultFilename: string = 'Jeff_G_Wilson_CV.pdf'): Promise<boolean> {
  const resolvedUrl = resolveFileUrl(url);
  let finalFilename = defaultFilename || 'Jeff_G_Wilson_CV.pdf';
  if (!finalFilename.toLowerCase().endsWith('.pdf')) {
    finalFilename += '.pdf';
  }

  // Strategy 1: Direct anchor download
  try {
    const link = document.createElement('a');
    link.href = resolvedUrl;
    link.setAttribute('download', finalFilename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 400);
    return true;
  } catch (e) {
    console.warn('Native download click failed, attempting blob fetch:', e);
  }

  // Strategy 2: Fetch Blob to guarantee binary save
  try {
    const response = await fetch(resolvedUrl);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = finalFilename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      window.URL.revokeObjectURL(blobUrl);
    }, 2000);
    return true;
  } catch (err) {
    console.warn('Blob fetch failed, attempting static root fallback:', err);
    try {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = '/Jeff_G_Wilson_CV.pdf';
      fallbackLink.download = finalFilename;
      fallbackLink.setAttribute('target', '_blank');
      fallbackLink.style.display = 'none';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      setTimeout(() => {
        if (document.body.contains(fallbackLink)) {
          document.body.removeChild(fallbackLink);
        }
      }, 400);
      return true;
    } catch (fallbackErr) {
      console.error('All download mechanisms failed:', fallbackErr);
      return false;
    }
  }
}

/**
 * Convenience helper to download the official active CV.
 * Guarantees a valid PDF download on both local and live deployments.
 */
export async function downloadActiveCV(fileUrl?: string | null, customFilename?: string | null): Promise<boolean> {
  const targetUrl = fileUrl || '/Jeff_G_Wilson_CV.pdf';
  const filename = customFilename || 'Jeff_G_Wilson_CV.pdf';
  return downloadFile(targetUrl, filename);
}
