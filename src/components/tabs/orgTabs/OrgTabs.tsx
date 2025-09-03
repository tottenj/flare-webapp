'use client';

import { Tab, Tabs } from '@heroui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrgTabs() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [selected, setselected] = useState(tab ?? 'myEvents');
  const [wasSelected, setWasSelectd] = useState('');

  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    if (!wasSelected || wasSelected != selected) {
      const params = new URLSearchParams(searchParams);
      params.set('tab', selected);
      setWasSelectd(selected);
      replace(`${pathname}?${params.toString()}`);
    }
  }, [selected]);

  return (
    <Tabs
      radius="full"
      variant="light"
      className="absolute h-[40px] w-full self-start overflow-hidden rounded-2xl rounded-b-none bg-white"
      fullWidth={true}
      color={'danger'}
      selectedKey={selected}
      onSelectionChange={(val) => setselected(val.toString())}
      classNames={{ tabContent: 'text-primary' }}
    >
      <Tab key={'myEvents'} title="My Events" />
      <Tab key={'savedEvents'} title="Saved Events" />
    </Tabs>
  );
}
