"use server"
import UserDashboard from '@/components/dashboards/UserDashboard';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';

export default async function UserDashboardPage() {
  const { fire, currentUser, firebaseServerApp } = await getFirestoreFromServer();
    if(!currentUser) return null
    
  return <UserDashboard fire={fire} currentUser={currentUser} firebase={firebaseServerApp} />;
}
