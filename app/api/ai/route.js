export async function POST(request) {
  try {
    const { message } = await request.json();

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: message,
      }),
    });

    // Ollama risponde a stream, quindi leggiamo progressivamente
    let text = '';
    const decoder = new TextDecoder();
    for await (const chunk of response.body) {
      text += decoder.decode(chunk);
    }

    return Response.json({ reply: text });
  } catch (error) {
    console.error('Errore:', error);
    return Response.json({ error: 'Errore durante la richiesta a Ollama' }, { status: 500 });
  }
}
