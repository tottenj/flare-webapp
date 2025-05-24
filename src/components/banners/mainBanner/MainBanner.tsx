"use server"
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import ProfilePicture from '@/components/profiles/profilePicture/ProfilePicture';
import { getAuthenticatedAppForUser } from '@/lib/firebase/auth/configs/serverApp';

export default async function MainBanner() {
  const { currentUser } = await getAuthenticatedAppForUser();

  
 return (
    <div className='w-full p-4 flex justify-between bg-white'>
        <ServerLogo size='medium'/>
        <ProfilePicture size={65}/>
        
    </div>
 )
}
