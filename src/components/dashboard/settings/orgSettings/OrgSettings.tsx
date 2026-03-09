'use client';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import DeleteAccountFormContainer from '@/components/forms/deleteAccountForm/DeleteAccountFormContainer';
import MainModal from '@/components/modals/MainModal/MainModal';

export default function OrgSettings() {
  return (
    <MainModal
      trigger={<HeroButton className='w-11/12 ml-auto mr-auto' color="danger">Delete Account</HeroButton>}
      modalProps={{ size: '2xl' }}
    >
      <DeleteAccountFormContainer />
    </MainModal>
  );
}
