import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export const usePageUrl = () => {
  const [pageUrl, setPageUrl] = useState('');
  const router = useRouter();

  const updateUrl = useCallback(() => {
    const fullUrl = window.location.origin + router.asPath;
    setPageUrl(fullUrl);
  }, [router.asPath]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      updateUrl(); // Initial URL set

      router.events.on('routeChangeComplete', updateUrl);
      return () => router.events.off('routeChangeComplete', updateUrl);
    }
  }, [router.events, updateUrl]); // Added router.events and updateUrl to dependencies

  return pageUrl;
};
