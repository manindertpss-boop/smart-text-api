// pages/api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Call Google Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY, // stored in Vercel env vars
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extract the AI's generated text
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No AI response";

    res.status(200).json({ text, raw: data });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
