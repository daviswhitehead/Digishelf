import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const usePageUrl = () => {
  const [pageUrl, setPageUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateUrl = () => {
        const fullUrl = window.location.origin + router.asPath;
        setPageUrl(fullUrl);
      };

      updateUrl();  // Initial URL set

      router.events.on('routeChangeComplete', updateUrl);
      return () => router.events.off('routeChangeComplete', updateUrl);
    }
  }, [router.asPath]); // Depend on router.asPath

  return pageUrl;
};
