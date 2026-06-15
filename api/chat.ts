// api/chat.ts

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { messages } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages,
          temperature: 0.5,
        }),
      }
    );

    const data = await response.json();

    return res.status(200).json({
      reply:
        data.choices?.[0]?.message?.content ??
        "Não consegui responder.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro interno",
    });
  }
}