import EventCardContainer from '@/components/events/EventCard/EventCardContainer';
import MainModal from '@/components/modals/MainModal/MainModal';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { Suspense } from 'react';

export default async function Page({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const ctx = await UserContextService.requireNone();
  const actor: AuthenticatedOrganization | undefined = ctx?.profile.orgProfile
    ? {
        orgId: ctx.profile.orgProfile.id,
        userId: ctx.user.id,
        firebaseUid: ctx.user.firebaseUid,
      }
    : undefined;

  return (
    <MainModal modalProps={{ size: '5xl' }} defaultOpen>
      <Suspense>
        <EventCardContainer eventId={eventId} actor={actor} />
      </Suspense>
    </MainModal>
  );
}
