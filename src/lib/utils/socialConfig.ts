import { ProofPlatform } from "@/lib/domain/ProofPlatform";
import { FileKey } from "@/lib/hooks/useFileChange/useFileChange";


export const SOCIAL_CONFIG = {
  instagram: {
    label: 'Instagram',
    platform: ProofPlatform.INSTAGRAM,
    placeholder: '@yourorg',
  },
  facebook: {
    label: 'Facebook',
    platform: ProofPlatform.FACEBOOK,
    placeholder: 'facebook.com/yourorg',
  },
  twitter: {
    label: 'Twitter / X',
    platform: ProofPlatform.X,
    placeholder: '@yourorg',
  },
} as const;


export function resolveProofPlatform(key: FileKey): ProofPlatform {
  if (key === 'other') return ProofPlatform.OTHER;
  return SOCIAL_CONFIG[key].platform;
}

export type SocialPlatform = keyof typeof SOCIAL_CONFIG;
