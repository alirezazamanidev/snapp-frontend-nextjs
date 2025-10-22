import { GetRole } from '@/libs/services/user-service';
import { cookies } from 'next/headers';
import { permanentRedirect, redirect } from 'next/navigation';

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('snapp-session')?.value;
  if (!token) redirect('/login');
  const role = await GetRole(token);
  if (!role) redirect('/select-role');
  if (role !== 'driver') permanentRedirect('/');
  return <>{children}</>;
}
