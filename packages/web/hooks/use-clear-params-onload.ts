'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useClearParamOnLoad(key: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const val = searchParams.get(key);
    if (val) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete(key);
      const newUrl = `${window.location.pathname}?${newParams.toString()}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [key, searchParams, router]);
}
