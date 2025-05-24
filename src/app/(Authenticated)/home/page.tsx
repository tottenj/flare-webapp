import OrgDashboard from '@/components/dashboards/OrgDashboard';
import UserDashboard from '@/components/dashboards/UserDashboard';
import getFirestoreFromServer from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { getAuthenticatedAppForUser } from '@/lib/firebase/auth/configs/serverApp';
import verifyOrg from '@/lib/firebase/utils/verifyOrg';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  let isOrg = false;

  const { currentUser, firebaseServerApp, fire } = await getFirestoreFromServer();
  if (currentUser) {
    try {
      isOrg = await verifyOrg(currentUser);
    } catch (error) {
      console.log(error);
    }

    if (isOrg) {
      return <OrgDashboard fire={fire} currentUser={currentUser} firebase={firebaseServerApp} />;
    } else {
      return <UserDashboard fire={fire} currentUser={currentUser} firebase={firebaseServerApp} />;
    }
  }
}
