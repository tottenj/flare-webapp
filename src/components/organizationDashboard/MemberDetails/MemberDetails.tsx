"use server"
import EditProfileButton from "@/components/buttons/editProfile/EditProfileButton";
import DeleteAccountForm from "@/components/forms/deleteAccountForm/DeleteAccountForm";
import EditOrgForm from "@/components/forms/editOrgForm/EditOrgForm";
import Tooltip from "@/components/info/toolTip/Tooltip";
import EditModal from "@/components/modals/editModal/EditModal";
import PassInModal from "@/components/modals/passInModal/PassInModal";
import ProfilePicture from "@/components/profiles/profilePicture/ProfilePicture";
import ProfilePictureSkeleton from "@/components/skeletons/ProfilePictureSkeleton/ProfilePictureSkeleton";
import FlareOrg from "@/lib/classes/flareOrg/FlareOrg";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Suspense } from "react";

export default async function MemberDetails({org}: {org: FlareOrg}) {
  return (
    <div className="flex h-full w-full flex-col rounded-2xl bg-white p-4">
      <div className="absolute right-4 flex gap-4">
        <EditModal>
          <EditOrgForm org={org.toPlain()} />
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
              <b>Organization Name: </b>
              {org.name}
            </p>
            <p className="secondaryHeader">
              <b>Email: </b>
              {org.email}
            </p>
            <div className="flex">
              <p className="secondaryHeader">
                <b>Status: </b>
              </p>
              <Tooltip text="Your organization is pending verification. You can create events now, but they won’t be visible publicly until your verification is complete. Verification usually takes up to 24 hours. Thanks for your patience!">
                <p className="secondaryHeader">{org.verified ? 'Verified ' : 'Pending'}</p>
              </Tooltip>
            </div>

            <p className="secondaryHeader">
              <b>Primary Location: </b>
              {org.location?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
