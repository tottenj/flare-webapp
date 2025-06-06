import VerifyButton from '@/components/buttons/verifyButton/VerifyButton';
import AddVerifiedModal from '@/components/modals/addVerifiedModal/AddVerifiedModal';
import Modal from '@/components/modals/mainModal/MainModal';
import Admin from '@/lib/classes/admin/Admin';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import Collections from '@/lib/enums/collections';
import { getServicesFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { getFile } from '@/lib/firebase/storage/storageOperations';
import Image from 'next/image';

export default async function page() {
  const { firestore, storage } = await getServicesFromServer();
  const orgs = await Admin.getUnverifiedOrgs(firestore);

  const orgsWithImages = await Promise.all(
    orgs.map(async (org) => ({
      ...org,
      images: await Admin.getImages(storage, org.id),
      profPic: await Admin.getProfilePic(storage, org.id)
    }))
  );




  return (
    <div className="flex flex-col items-center">
      <h1 className="text-center">Admin</h1>
      <div className="flex w-3/4 rounded-2xl bg-white p-4 gap-8">
        {orgsWithImages.map((org) => (
          <AddVerifiedModal key={org.id} profPic={org.profPic} orgName={org.name}>
            <div className="flex flex-col items-center">
              <h1>{org.name}</h1>
              <div className="flex flex-wrap">
                {org.images.map((img) => (
                  <Image key={img} src={img} alt="image" width={250} height={250} />
                ))}
              </div>
              <div>
                <p><b>Email: </b>{org.email}</p>
                <p><b>Location: </b>{org.location?.name}</p>
                <p><b>Description</b>{org.description}</p>
              </div>
            </div>
            <VerifyButton orgId={org.id}/>
          </AddVerifiedModal>
        ))}
      </div>
    </div>
  );
}
