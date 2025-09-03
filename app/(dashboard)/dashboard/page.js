import Protected from '@/components/auth/Protected';
import DashboardHome from '@/components/features/dashboard/home/DashboardHome';

export default async function Dashboard() {
  return (
    <Protected>
      <DashboardHome />
    </Protected>
  );
}
