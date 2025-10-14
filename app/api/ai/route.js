export async function POST(req) {
  const { message } = await req.json();

  // Richiesta a Ollama (localhost)
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral',
      prompt: message,
      stream: true, // importantissimo
    }),
  });

  // Restituisci direttamente lo stream
  const encoder = new TextEncoder();
  const transformStream = new TransformStream();
  const writer = transformStream.writable.getWriter();

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunkStr = decoder.decode(value);
      const lines = chunkStr.split('\n').filter(Boolean);

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            await writer.write(encoder.encode(JSON.stringify(parsed) + '\n'));
          }
        } catch {}
      }
    }
    writer.close();
  })();

  return new Response(transformStream.readable, {
    headers: { 'Content-Type': 'application/json' },
  });
}
