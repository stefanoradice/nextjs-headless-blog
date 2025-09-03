import DashboardCommentItem from './DashboardCommentItem';

export default function DashboardCommentList({ comments }) {
  if (!comments.length) return <p>Nessun commento ancora.</p>;
  return (
    <ul className="flex flex-col gap-2">
      {comments.map((comment) => (
        <DashboardCommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}
