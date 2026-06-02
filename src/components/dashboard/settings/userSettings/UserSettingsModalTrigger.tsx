'use client';

import MainModal from '@/components/modals/MainModal/MainModal';
import OrgSettings from '@/components/dashboard/settings/orgSettings/OrgSettings';
import UserSettings from '@/components/dashboard/settings/userSettings/UserSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

export default function UserSettingsModalTrigger() {
  return (
    <MainModal
      header="Settings"
      modalProps={{ size: '2xl' }}
      trigger={
        <button
          type="button"
          aria-label="Open settings"
          className="border-primary text-primary hover:bg-primary flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full border-2 bg-white transition duration-100 ease-in-out hover:scale-110 hover:text-white"
        >
          <span aria-hidden="true"><FontAwesomeIcon icon={faGear}/></span>
        </button>
      }
    >
      <UserSettings />
    </MainModal>
  );
}
