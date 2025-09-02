import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import CloseViewModal from '@/components/modals/CloseViewModal';
import Modal from '@/components/modals/mainModal/MainModal';

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string; back?: string }>;
}) {
  const { id } = await params 
  const search = await searchParams;
  const returnTo = search.returnTo;
  const back = search.back == 'true';

  return (
    <Modal back={back} returnTo={returnTo}>
      <div className="relative h-full">
            <EventInfoContainer slug={id} />
      </div>
    </Modal>
  );
}
