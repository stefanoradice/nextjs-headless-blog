import { getPostById } from '@/lib/api/client';
import Link from 'next/link';

export default async function DashboardCommentItem({ comment }) {
  const post = await getPostById(comment.post);

  return (
    <li className="border p-2 rounded">
      <div dangerouslySetInnerHTML={{ __html: comment?.content?.rendered || '' }} />
      <small>
        Articolo:{' '}
        <Link className="font-bold" href={`/blog/${post.slug}#comment-${comment.id}`}>
          {' '}
          {post?.title?.rendered}
        </Link>{' '}
        | Data: {new Date(comment.date).toLocaleString()}
      </small>
    </li>
  );
}
