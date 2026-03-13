'use client';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import DeleteAccountFormContainer from '@/components/forms/deleteAccountForm/DeleteAccountFormContainer';
import MainModal from '@/components/modals/MainModal/MainModal';

export default function OrgSettings() {
  return (
    <MainModal
      trigger={
        <HeroButton className="mr-auto ml-auto w-11/12" color="danger">
          Delete Account
        </HeroButton>
      }
      modalProps={{ size: '2xl' }}
    >
      {(close: () => void) => <DeleteAccountFormContainer onClose={close} />}
    </MainModal>
  );
}
