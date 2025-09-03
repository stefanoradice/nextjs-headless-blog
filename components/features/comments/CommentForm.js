'use client';

import { useWS } from '@/context/WSContext';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function CommentForm({
  post,
  replyToCommentId,
  setReplyToCommentId,
  formData,
  setFormData,
  queryClient,
}) {
  const [successMessage, setSuccessMessage] = useState('');
  const { sendMessage, subscribe } = useWS();

  useEffect(() => {
    // ricevo solo commenti nuovi
    const unsubscribe = subscribe('comment', (comment) => {
      queryClient.invalidateQueries(['comments', comment.post]);
    });

    return () => unsubscribe();
  }, [subscribe, queryClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // react query invia i dati e aggiorna la query in cache e aggiorna la cache attuale senza rifetch
  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      //verifica se formData ha proprietà comment, vuol dire che deve fare edit non create
      const res = await fetch(`/api/comments?post=${post.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error("Errore nell'invio del commento");
      return res.json();
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(['comments', post.id], (oldComments) => {
        if (!oldComments) return [newComment];

        return [newComment, ...oldComments];
      });
      setSuccessMessage('Commento inviato con successo!');
      resetForm();
      sendMessage({ type: 'comment', data: newComment });

      // opzionale: puoi anche invalidare per rifetchare in background
      queryClient.invalidateQueries(['comments', post.id]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.comment) {
      await fetch(`/api/comments/${formData.comment}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: formData.content }),
      });
      queryClient.invalidateQueries(['comments', post.id]);
      setReplyToCommentId(null);
      resetForm();
      setSuccessMessage('Commento aggiornato con successo!');
      sendMessage({ type: 'comment', data: formData });
      return;
    }
    addCommentMutation.mutate({
      ...formData,
      parent: replyToCommentId ?? undefined,
    });
  };

  const resetForm = () => setFormData({ author: '', email: '', content: '' });

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-10 p-4 border border-gray-300 rounded shadow-md max-w-xxl"
    >
      {replyToCommentId ? (
        <p>
          Stai rispondendo al commento #{replyToCommentId}
          <button onClick={() => setReplyToCommentId(null)} className="ml-2 text-red-600">
            Annulla
          </button>
        </p>
      ) : (
        <h3 className="text-xl font-semibold mb-4">Lascia un commento</h3>
      )}

      {successMessage && <p className="text-green-600 my-4">{successMessage}</p>}
      <div className="mb-4">
        <label className="block mb-1">Commento</label>
        <textarea
          name="content"
          value={formData.content || ''}
          onChange={handleChange}
          rows="5"
          className="w-full border border-gray-500 px-3 py-2 rounded"
          required
        />
      </div>

      <button
        disabled={addCommentMutation.isLoading}
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Invia commento
      </button>
    </form>
  );
}
