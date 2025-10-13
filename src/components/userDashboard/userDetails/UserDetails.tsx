'use server';
import EditProfileButton from '@/components/buttons/editProfile/EditProfileButton';
import DeleteAccountForm from '@/components/forms/deleteAccountForm/DeleteAccountForm';
import EditUserForm from '@/components/forms/editUserForm/EditUserForm';
import Tooltip from '@/components/info/toolTip/Tooltip';
import EditModal from '@/components/modals/editModal/EditModal';
import PassInModal from '@/components/modals/passInModal/PassInModal';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import ProfilePictureSkeleton from '@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Suspense } from 'react';

interface userDetailsProps {
  user: FlareUser;
}

export default async function UserDetails({ user }: userDetailsProps) {
  return (
    <div
      data-cy="userDetails"
      className="relative flex h-full w-full flex-col rounded-2xl bg-white p-4"
    >
      <div className="absolute right-4 flex gap-4">
        <EditModal>
          <EditUserForm user={user.toPlain()} />
        </EditModal>
        <EditModal icon={faGear}>
          <div className="flex min-h-[500px] flex-col items-center justify-between">
            <h2>Settings</h2>
            <PassInModal
              trigger={
                <div className="bg-red w-11/12 rounded-2xl p-2 font-black text-white hover:bg-red-600">
                  Delete Account?
                </div>
              }
            >
              <DeleteAccountForm />
            </PassInModal>
          </div>
        </EditModal>
      </div>
      <h2>Member Details</h2>
      <div className="mt-4 flex flex-col">
        <div className="flex gap-8">
          <div>
            <Suspense fallback={<ProfilePictureSkeleton size={100} />}>
              <ProfilePicture size={100} />
            </Suspense>
            <EditProfileButton />
          </div>
          <div>
            <p className="secondaryHeader">
              <b>Name: </b>
              {user.name}
            </p>
            <p className="secondaryHeader">
              <b>Email: </b>
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
