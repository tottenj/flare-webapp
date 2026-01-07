import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const ctx = await UserContextService.requireUser();

  if (ctx.flags.isAdmin) {
    redirect('/admin/dashboard');
  }

  if (ctx.flags.isOrg) {
    redirect('/org/dashboard');
  }

  redirect('/user/dashboard');
}
