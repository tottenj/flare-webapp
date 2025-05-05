import { useAuth } from '@/components/context/AuthContext';
import { useServerUser } from '@/components/context/ServerUserContext';

export default function useUnifiedUser() {
  const serverUser = useServerUser();
  const { user: clientUser, loading } = useAuth();

  const unifiedUser = clientUser ?? serverUser;

  return { user: unifiedUser, loading };
}
