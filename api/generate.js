export default async function handler(req, res) {
  // CORS for Shopify/frontend testing
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing OpenAI API key");
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "No prompt provided" });

    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Write a nice greeting based on: ${prompt}`,
        max_tokens: 80
      })
    });

    const data = await response.json();
    console.log("✅ OpenAI Response:", data);

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: "No AI response", raw: data });
    }

    res.status(200).json({ text: data.choices[0].text.trim() });
  } catch (err) {
    console.error("❌ API Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
