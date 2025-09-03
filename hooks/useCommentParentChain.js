import { fetchCommentById } from '@/lib/api/client/commentsClient';
import { useEffect, useState } from 'react';

export function useCommentParentChain() {
  const [parentChain, setParentChain] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!window.location.hash?.startsWith('#comment-')) return;
    const commentId = parseInt(window.location.hash.replace('#comment-', ''), 10);
    if (!commentId) return;

    const buildChain = async (id) => {
      const chain = [id];
      let currentId = id;

      while (true) {
        const comment = await fetchCommentById(currentId);
        if (!comment.parent || comment.parent === 0) break;
        chain.unshift(comment.parent);
        currentId = comment.parent;
      }

      setParentChain(chain);
      setReady(true);
    };

    buildChain(commentId);
  }, []);

  return { parentChain, ready };
}
