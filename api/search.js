export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, catalog } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are a personal stylist for MAGASIN COLLECTION. Match the customer's request to the most suitable products. Return ONLY a raw JSON array, no markdown, no backticks. Format: [{"id": 1, "reason": "One warm specific sentence."}]. Return 3-5 matches max. Return [] if nothing fits.`,
      messages: [{
        role: 'user',
        content: `Customer: "${query}"\n\nCatalog:\n${JSON.stringify(catalog)}\n\nReturn only the JSON array.`
      }]
    })
  });

  const data = await response.json();
  const text = data.content?.[0]?.text || '[]';
  
  try {
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
    return res.status(200).json({ results: parsed });
  } catch(e) {
    return res.status(200).json({ results: [] });
  }
}