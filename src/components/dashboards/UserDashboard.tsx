import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

interface userDashboardProps {
  firebase: FirebaseApp;
  currentUser: User
  fire: Firestore
}
export default function UserDashboard({firebase, currentUser, fire}:userDashboardProps) {
  
  return <div>UserDashboard</div>;
}
