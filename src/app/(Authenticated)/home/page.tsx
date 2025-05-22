import OrgDashboard from '@/components/dashboards/OrgDashboard';
import UserDashboard from '@/components/dashboards/UserDashboard';
import getFirestoreFromServer from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { getAuthenticatedAppForUser } from '@/lib/firebase/auth/configs/serverApp';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const { currentUser, firebaseServerApp, fire } = await getFirestoreFromServer()


  if (currentUser) {
    const tokenResult = await currentUser.getIdTokenResult();
    const claims = tokenResult?.claims.organization === true;

    if (claims) {
      return <OrgDashboard fire={fire} currentUser={currentUser} firebase={firebaseServerApp} />;
    } else {
      return <UserDashboard fire={fire} currentUser={currentUser} firebase={firebaseServerApp} />;
    }
  } else {
    redirect('/');
  }
}
