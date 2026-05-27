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
      system: `You are a personal stylist for MAGASIN COLLECTION, a minimalistic editorial luxury fashion store. Match the customer's request to the most suitable products.

OUTPUT: Return ONLY a raw JSON array. No markdown, no backticks, no text outside the array.
Format: [{"id": 1, "reason": "One warm specific sentence why this fits the request."}]
Rules: 3-5 products max, genuine matches only, honour budgets, reason sounds like a real stylist. Return [] if nothing fits.`,
      messages: [{
        role: 'user',
        content: `Customer: "${query}"\n\nCatalog:\n${JSON.stringify(catalog, null, 2)}\n\nReturn only the JSON array.`
      }]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}