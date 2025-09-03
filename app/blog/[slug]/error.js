'use client';
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>{`Errore nel caricamento dell'articolo.`}</h2>
      <button onClick={() => reset()}>Riprova</button>
    </div>
  );
}
