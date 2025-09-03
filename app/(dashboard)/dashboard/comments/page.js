import DashboardCommentList from '@/components/features/dashboard/comments/DashboardCommentsList';
import { fetchCommentsByUser } from '@/lib/api/server';

export default async function CommentsPage() {
  const comments = await fetchCommentsByUser();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">I miei commenti</h1>
      <DashboardCommentList comments={comments} />
    </div>
  );
}
