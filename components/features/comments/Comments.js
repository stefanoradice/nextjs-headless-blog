'use client';
import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentsList from './CommentsList';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';

export default function Comments({ post }) {
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    post: post.id,
    author_name: '',
    author_email: '',
    content: '',
  });

  return (
    <>
      <CommentsList
        setFormData={setFormData}
        setReplyToCommentId={setReplyToCommentId}
        post={post}
      />
      {user && (
        <CommentForm
          formData={formData}
          setFormData={setFormData}
          queryClient={queryClient}
          replyToCommentId={replyToCommentId}
          setReplyToCommentId={setReplyToCommentId}
          post={post}
        />
      )}
    </>
  );
}
