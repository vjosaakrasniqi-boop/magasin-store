export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  const PRODUCTS = [
    { id:1, name:'Oversized Linen Blazer', category:'Women', subcategory:'Blazers', price:245, onSale:false, colors:['Oat','Black'], sizes:['XS','S','M','L','XL'], tags:['blazer','workwear','smart casual','linen','summer'], description:'A relaxed silhouette cut from breathable Italian linen.' },
    { id:2, name:'Silk Slip Dress', category:'Women', subcategory:'Dresses', price:185, onSale:false, colors:['Ivory','Sage','Black'], sizes:['XS','S','M','L'], tags:['dress','evening','wedding','summer','silk'], description:'Crafted from liquid silk satin, ideal for summer evenings.' },
    { id:3, name:'Wool Longline Coat', category:'Women', subcategory:'Outerwear', price:389, onSale:false, colors:['Camel','Black'], sizes:['XS','S','M','L'], tags:['coat','wool','winter','outerwear'], description:'Heavyweight wool blend, falls below the knee.' },
    { id:4, name:'Wide Leg Trousers', category:'Women', subcategory:'Trousers', price:98, onSale:true, colors:['Ecru','Black','Navy'], sizes:['XS','S','M','L','XL'], tags:['trousers','office','smart','casual'], description:'High-waisted with a generous leg opening.' },
    { id:5, name:'Ribbed Cashmere Sweater', category:'Women', subcategory:'Knitwear', price:220, onSale:false, colors:['Oat','Sage','Grey'], sizes:['XS','S','M','L'], tags:['cashmere','knitwear','cosy','winter'], description:'Pure Grade-A cashmere in a close-knit ribbed construction.' },
    { id:6, name:'Tailored Midi Skirt', category:'Women', subcategory:'Skirts', price:155, onSale:false, colors:['Black','Camel'], sizes:['XS','S','M','L'], tags:['skirt','midi','tailored','office','smart'], description:'A perfectly weighted midi skirt with a hidden zip.' },
    { id:7, name:'Cotton Poplin Shirt', category:'Women', subcategory:'Tops', price:95, onSale:false, colors:['White','Blue'], sizes:['XS','S','M','L','XL'], tags:['shirt','cotton','casual','workwear'], description:'A true wardrobe staple in crisp cotton poplin.' },
    { id:8, name:'Satin Wrap Blouse', category:'Women', subcategory:'Tops', price:79, onSale:true, colors:['Ivory','Forest'], sizes:['XS','S','M','L'], tags:['blouse','satin','evening','elegant','wedding'], description:'A fluid wrap blouse in satin crepe with a V-neckline.' },
    { id:9, name:'Merino Roll Neck', category:'Men', subcategory:'Knitwear', price:165, onSale:false, colors:['Oat','Charcoal','Sage'], sizes:['S','M','L','XL','XXL'], tags:['knitwear','roll neck','winter','smart casual'], description:'Extra-fine merino wool in a classic roll neck.' },
    { id:10, name:'Relaxed Chino', category:'Men', subcategory:'Trousers', price:120, onSale:false, colors:['Stone','Navy','Khaki'], sizes:['28','30','32','34','36'], tags:['chino','trousers','casual','smart casual'], description:'Cut in a relaxed tapered fit from soft cotton twill.' },
    { id:11, name:'Tailored Wool Blazer', category:'Men', subcategory:'Blazers', price:320, onSale:false, colors:['Charcoal','Navy'], sizes:['S','M','L','XL'], tags:['blazer','wool','smart','wedding','formal'], description:'Single-breasted blazer in textured wool mix.' },
    { id:12, name:'Classic Oxford Shirt', category:'Men', subcategory:'Shirts', price:59, onSale:true, colors:['White','Blue','Pink'], sizes:['S','M','L','XL','XXL'], tags:['shirt','oxford','workwear','casual'], description:'The quintessential Oxford shirt in soft breathable cotton.' },
    { id:13, name:'Slim Selvedge Denim', category:'Men', subcategory:'Denim', price:175, onSale:false, colors:['Indigo','Black'], sizes:['28','30','32','34'], tags:['denim','jeans','casual','everyday'], description:'Japanese selvedge denim in a slim straight cut.' },
    { id:14, name:'Leather Bomber Jacket', category:'Men', subcategory:'Outerwear', price:450, onSale:false, colors:['Black','Tan'], sizes:['S','M','L','XL'], tags:['jacket','leather','bomber','outerwear','casual'], description:'Full-grain leather in a classic bomber silhouette.' },
    { id:15, name:'Structured Leather Tote', category:'Accessories', subcategory:'Bags', price:280, onSale:false, colors:['Black','Tan','Sage'], sizes:['One Size'], tags:['bag','tote','leather','workwear','everyday'], description:'A generous structured tote in vegetable-tanned leather.' },
    { id:16, name:'Wool Oversized Scarf', category:'Accessories', subcategory:'Scarves', price:89, onSale:false, colors:['Oat','Grey','Sage'], sizes:['One Size'], tags:['scarf','wool','winter','cosy'], description:'Oversized wool blend scarf, softest hand feel.' },
    { id:17, name:'Leather Belt', category:'Accessories', subcategory:'Belts', price:65, onSale:false, colors:['Black','Tan'], sizes:['S','M','L'], tags:['belt','leather','everyday','essential'], description:'Minimal clean-edge belt in full-grain leather.' },
    { id:18, name:'Gold Hoop Earrings', category:'Accessories', subcategory:'Jewellery', price:55, onSale:false, colors:['Gold'], sizes:['One Size'], tags:['earrings','gold','jewellery','wedding','evening','gift'], description:'Lightweight 18k gold-plated hoops.' },
    { id:19, name:'Acetate Sunglasses', category:'Accessories', subcategory:'Eyewear', price:120, onSale:false, colors:['Black','Tortoise'], sizes:['One Size'], tags:['sunglasses','summer','eyewear','everyday'], description:'Oversized oval frame in polished acetate with UV400 lenses.' },
    { id:20, name:'Canvas Weekender Bag', category:'Accessories', subcategory:'Bags', price:195, onSale:false, colors:['Natural','Black'], sizes:['One Size'], tags:['bag','weekend','canvas','travel'], description:'Generous overnight bag in waxed canvas.' },
    { id:21, name:'Cashmere Beanie', category:'Accessories', subcategory:'Hats', price:55, onSale:true, colors:['Oat','Black','Sage'], sizes:['One Size'], tags:['beanie','cashmere','winter','cosy','gift'], description:'A slouchy beanie in Grade-A cashmere.' },
    { id:22, name:'Silk Hair Scarf', category:'Accessories', subcategory:'Hair', price:45, onSale:false, colors:['Ivory','Sage','Black'], sizes:['One Size'], tags:['scarf','silk','summer','gift'], description:'100% pure silk square, wear many ways.' },
  ];

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
      system: `You are a personal stylist for MAGASIN COLLECTION. Match the customer's request to the most suitable products from the catalog. Return ONLY a raw JSON array, no markdown, no backticks, no explanation. Format: [{"id": 1, "reason": "One warm specific sentence why this fits."}]. Return 3-5 genuine matches. Honour any budget mentioned. Return [] if truly nothing fits.`,
      messages: [{
        role: 'user',
        content: `Customer request: "${query}"\n\nProduct catalog:\n${JSON.stringify(PRODUCTS)}\n\nReturn only the JSON array.`
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