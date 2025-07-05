// stories/utils/DelayWrapper.tsx

import React from 'react';

export function DelayWrapper({ children, ms = 2000 }: { children: React.ReactNode; ms?: number }) {
  const suspender = createSuspender(ms);
  suspender();
  return <>{children}</>;
}

function createSuspender(ms: number) {
  let promise: Promise<void> | null = null;
  return () => {
    if (!promise) {
      promise = new Promise((resolve) => setTimeout(resolve, ms));
    }
    throw promise;
  };
}
