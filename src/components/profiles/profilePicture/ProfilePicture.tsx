import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import {
  getServicesFromServer,
} from '@/lib/firebase/auth/configs/getFirestoreFromServer';

import { getClaims } from '@/lib/firebase/utils/getClaims';
import Image from 'next/image';

interface profilePictureProps {
  size: number;
}

export default async function ProfilePicture({ size }: profilePictureProps) {
  let retval = '/defaultProfile.svg';
  let claimsobj = false;
  const { currentUser, firestore, storage } = await getServicesFromServer();
  const {claims} = await getClaims()
  if (claims) {
    claimsobj = claims.organization === true;
  }

  if (currentUser) {
    if (claimsobj) {
      const flareOrg = await FlareOrg.getOrg(firestore, currentUser.uid);
      if (flareOrg?.profilePic) {
        const pic = await flareOrg.getProfilePicture(firestore, storage);
        if (pic) {
          retval = pic;
        }
      }
    } else {
      const flareUser = await FlareUser.getUserById(currentUser.uid, firestore);
      if (flareUser?.profilePic) {
        const pic = await flareUser.getProfilePic(firestore, storage);
        if (pic) {
          retval = pic;
        }
      }
    }
  }
  return (
    <div className="relative overflow-hidden rounded-full" style={{ width: size, height: size }}>
      <Image src={retval} alt="profile" fill className="object-cover" />
    </div>
  );
}
