import { Avatar } from '@heroui/react';
import type { ComponentProps } from 'react';

export type HeroAvatarProps = ComponentProps<typeof Avatar>;

function HeroAvatarRoot(props: HeroAvatarProps) {
  return <Avatar {...props} />;
}

const HeroAvatar = Object.assign(HeroAvatarRoot, {
  Image: Avatar.Image,
  Fallback: Avatar.Fallback,
});

export default HeroAvatar;
