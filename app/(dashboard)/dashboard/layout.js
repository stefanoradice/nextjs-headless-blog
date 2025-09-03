import DashboardSidebar from '@/components/features/dashboard/layout/DashboardSidebar';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-150 bg-gray-100">
      <DashboardSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
