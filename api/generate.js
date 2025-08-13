export default async function handler(req, res) {
  // Allow POST only
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    // Example using OpenAI API
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Write a nice greeting based on: ${prompt}`,
        max_tokens: 80
      })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.text?.trim() || 'No result';

    res.status(200).json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
