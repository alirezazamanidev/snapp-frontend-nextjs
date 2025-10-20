
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { CheckDriverProfile } from '@/libs/services/user-service';

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('snapp-session')?.value;
  if (!token) redirect('/login');
  const hasProfile = await CheckDriverProfile(token);
  if (!hasProfile) redirect('/driver-profile');
  return <>{children}</>;
}
