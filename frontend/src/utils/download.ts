const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

/**
 * Resolves a full, downloadable URL whether relative or absolute.
 */
export function resolveFileUrl(url: string): string {
  if (!url) return `${API_BASE}/cv/download`;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }

  // Handle absolute or relative paths with API_BASE
  if (url.startsWith('/')) {
    if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
      try {
        const origin = new URL(API_BASE).origin;
        return `${origin}${url}`;
      } catch {
        return url;
      }
    }
  }
  return url;
}

/**
 * Downloads a file directly to the user's device.
 * Uses native download anchor and blob streaming fallback.
 */
export async function downloadFile(url: string, defaultFilename: string = 'Jeff_G_Wilson_CV.pdf'): Promise<boolean> {
  const resolvedUrl = resolveFileUrl(url);
  let finalFilename = defaultFilename;
  if (!finalFilename.toLowerCase().endsWith('.pdf') && resolvedUrl.toLowerCase().endsWith('.pdf')) {
    finalFilename += '.pdf';
  }

  // Strategy 1: Direct native browser link download trigger
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
    }, 300);
  } catch (e) {
    console.warn('Native download click failed, attempting blob fetch:', e);
  }

  // Strategy 2: Fetch Blob to guarantee binary download
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
      fallbackLink.style.display = 'none';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      setTimeout(() => {
        if (document.body.contains(fallbackLink)) {
          document.body.removeChild(fallbackLink);
        }
      }, 300);
      return true;
    } catch (fallbackErr) {
      console.error('All download mechanisms failed:', fallbackErr);
      return false;
    }
  }
}

/**
 * Convenience helper to download the official active CV
 */
export async function downloadActiveCV(fileUrl?: string | null, customFilename?: string | null): Promise<boolean> {
  const targetUrl = `${API_BASE}/cv/download`;
  const filename = customFilename || 'Jeff_G_Wilson_CV.pdf';
  return downloadFile(targetUrl, filename);
}
