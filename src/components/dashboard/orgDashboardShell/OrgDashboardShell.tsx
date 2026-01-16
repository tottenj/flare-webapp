'use server';

import SquarePlus from '@/components/buttons/squarePlus/SquarePlus';
import OrgDashboardInfoPresentational from '@/components/dashboard/orgDashboard/orgDashboardInfo/OrgDashboardInfoPresentational';
import EventList from '@/components/events/EventList/EventList';
import EventFormContainer from '@/components/forms/eventForm/EventFormContainer';
import MainModal from '@/components/modals/MainModal/MainModal';
import { UserContextService } from '@/lib/services/userContextService/userContextService';

export default async function OrgDashboardShell() {
  const ctx = await UserContextService.requireOrg();

  return (
    <div className="grid h-full w-full grid-cols-1 md:grid-cols-2 grid-rows-[1fr_3fr] gap-4">
      <OrgDashboardInfoPresentational
        profilePicPath={ctx.user.profilePic}
        orgName={ctx.profile.orgProfile!.orgName}
        email={ctx.user.email}
        status={ctx.profile.orgProfile!.status}
      />
      <div className="row-span-2 h-full w-full rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between pb-4">
          <h2>My Events</h2>
          <MainModal trigger={<SquarePlus />} header={<h2 className='text-center w-full'>Create New Event</h2>} modalProps={{size: '3xl'}}>
            <EventFormContainer />
          </MainModal>
        </div>
        <EventList />
      </div>
    </div>
  );
}
