'use client';

import MainModal from '@/components/modals/MainModal/MainModal';
import OrgSettings from '@/components/dashboard/settings/orgSettings/OrgSettings';

export default function OrgSettingsModalTrigger() {
  return (
    <MainModal
      header="Settings"
      modalProps={{ size: '2xl' }}
      trigger={
        <button
          type="button"
          aria-label="Open settings"
          className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border-2 border-primary bg-white text-primary transition duration-100 ease-in-out hover:scale-110 hover:bg-primary hover:text-white"
        >
          <span aria-hidden="true">⚙</span>
        </button>
      }
    >
      <OrgSettings />
    </MainModal>
  );
}
