import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import { getAuthenticatedAppForUser } from '@/lib/firebase/auth/configs/serverApp';

export default async function MainBanner() {
  const { currentUser } = await getAuthenticatedAppForUser();

  
 return (
    <div className='w-full p-4 flex justify-between'>
        <LogoWithText size={60}/>
        <ProfilePicture size={65}/>
    </div>
 )
}
