import type { StoryObj, Meta } from '@storybook/react';
import type { AdminOrgDetailsViewModel } from '@/lib/schemas/admin/AdminOrgDetailsDto';

import AdminOrgPresentational from './AdminOrgPresentational';
import VerifyOrgButton from '@/components/buttons/verifyOrgButton/VerifyOrgButton';

const mockOrg: AdminOrgDetailsViewModel = {
  id: 'org_123',
  orgName: 'Flare Community',
  email: 'admin@flare.test',
  location: 'Chicago, IL',
  profilePicPath: null,
  socials: {
    instagramHandle: '@flarecommunity',
    facebookHandle: null,
    xHandle: '@flarecommunity',
    otherText: null,
  },
  proofs: [
    {
      id: 'proof_1',
      platform: 'INSTAGRAM',
      storagePath: 'users/demo/proofs/instagram-proof.png',
      createdAt: new Date('2026-01-01T12:00:00.000Z'),
      imageUrl: null,
    },
  ],
};

export default {
  component: AdminOrgPresentational,
  title: 'Admin/AdminOrgPresentational',
} satisfies Meta<typeof AdminOrgPresentational>;

type Story = StoryObj<typeof AdminOrgPresentational>;

export const Default: Story = {
  args: {
    org: mockOrg,
    actions: <VerifyOrgButton orgId={mockOrg.id} />,
  },
};
