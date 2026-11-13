import HeroFile, { type HeroFileProps } from '@/components/inputs/hero/file/HeroFile';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import { SOCIAL_CONFIG, type SocialPlatform } from '@/lib/utils/socialConfig';

export type SocialProofProps = {
  platform: SocialPlatform;
  onChange?: HeroFileProps['onChange'];
};

export default function SocialProof({ platform, onChange }: SocialProofProps) {
  const config = SOCIAL_CONFIG[platform];

  return (
    <div className="border-separator flex flex-col gap-3 border-b py-4 last:border-b-0">
      <HeroInput
        label={`${config.label} Handle`}
        name={platform}
        placeholder={config.placeholder}
      />
      <HeroFile label={`${config.label} Proof`} name={`${platform}-file`} onChange={onChange} />
    </div>
  );
}