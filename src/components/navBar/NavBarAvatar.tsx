import HeroAvatar from '@/components/ui/HeroAvatar/HeroAvatar';
import ImageService from '@/lib/services/imageService/ImageService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { logger } from '@/lib/logger';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavBarAvatarDropdown from './NavBarAvatarDropdown';
import Link from 'next/link';

export default async function NavBarAvatar() {
  const context = await UserContextService.requireNone();
  if (!context) {
    return (
      <Link href={"/signin"}>
        <HeroAvatar color="accent" variant="soft">
          <HeroAvatar.Fallback>
            <FontAwesomeIcon aria-hidden="true" icon={faUser} />
          </HeroAvatar.Fallback>
        </HeroAvatar>
      </Link>
    );
  }

  const { email, profilePic } = context.user;
  let profilePictureUrl: string | undefined;

  if (profilePic) {
    try {
      profilePictureUrl = await ImageService.getDownloadUrl(profilePic);
    } catch (error) {
      logger.error(error instanceof Error ? error.message : 'Unable to load profile picture');
    }
  }

  const initials =
    email
      .split('@')[0]
      .split(/[._-]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('') || email[0].toUpperCase();

  return (
    <NavBarAvatarDropdown>
      <HeroAvatar color="accent" variant="soft">
        {profilePictureUrl && (
          <HeroAvatar.Image alt={`Profile picture for ${email}`} src={profilePictureUrl} />
        )}
        <HeroAvatar.Fallback>{initials}</HeroAvatar.Fallback>
      </HeroAvatar>
    </NavBarAvatarDropdown>
  );
}
