import EventCardContainer from '@/components/events/EventCard/EventCardContainer';
import ModalRouter from '@/components/modals/ModalRouter/ModalRouter';
import { EventModalSearchParamsSchema } from '@/lib/schemas/routes/eventModalSearchParamsSchema';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { Suspense } from 'react';

type EventModalSearchParams = {
  returnTo?: string;
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams?: Promise<EventModalSearchParams>;
}) {
  const { eventId } = await params;
  const searchRaw = await searchParams;
  const search = EventModalSearchParamsSchema.safeParse(searchRaw);
  const returnTo = search.success ? search.data.returnTo : undefined;
  const ctx = await UserContextService.requireNone();
  const actor: AuthenticatedOrganization | undefined = ctx?.profile.orgProfile
    ? {
        orgId: ctx.profile.orgProfile.id,
        userId: ctx.user.id,
        firebaseUid: ctx.user.firebaseUid,
      }
    : undefined;

  return (
    <>
    <ModalRouter returnTo={returnTo} returnToFallback="/events" modalProps={{ size: '5xl' }}>
      <Suspense fallback={<div className="flex h-96 items-center justify-center">Loading...</div>}>
        <EventCardContainer eventId={eventId} actor={actor} />
      </Suspense>
    </ModalRouter>
    </>
  );
}
