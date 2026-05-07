import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = { black:'#0A0A0A', white:'#FFFFFF', sage:'#7A9E7E', sageLight:'#EBF1EB', sageDark:'#3D6641', slate:'#6B6B6B', fog:'#F5F5F5', border:'#E5E5E5' };
const F = { display:"'Cormorant Garamond', serif", body:"'Jost', sans-serif" };
const CM = { Black:'#1A1A1A', White:'#F0F0F0', Ivory:'#F5F0E8', Oat:'#E2D9C8', Camel:'#C19A6B', Sage:'#7A9E7E', Grey:'#9B9B9B', Navy:'#1B2A4A', Ecru:'#EDE8DC', Charcoal:'#3D3D3D', Indigo:'#3D4B7A', Tan:'#C4936A', Gold:'#D4AF37', Tortoise:'#5C3D1E', Natural:'#D4C5A9', Forest:'#2D5016', Blue:'#4A6FA5', Pink:'#E8B4B8', Khaki:'#8B8566', Stone:'#9E9689' };

// ─── Product data ─────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1,  name:'Oversized Linen Blazer',   cat:'Women', sub:'Blazers',   price:245, sale:null, sizes:['XS','S','M','L','XL'],   colors:['Oat','Black'],          badge:'New In', img:'https://images.unsplash.com/photo-1594938298603-5f0c91647571?w=800&h=1000&fit=crop&q=80', tags:['blazer','workwear','smart casual','linen','summer'],    desc:'A relaxed silhouette cut from breathable Italian linen. Slightly boxy fit and notch lapels give it an effortlessly polished feel — over tailored trousers or with denim.' },
  { id:2,  name:'Silk Slip Dress',           cat:'Women', sub:'Dresses',   price:185, sale:null, sizes:['XS','S','M','L'],         colors:['Ivory','Sage','Black'], badge:'New In', img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&q=80', tags:['dress','evening','wedding','summer','silk'],             desc:'Crafted from liquid silk satin. Adjustable spaghetti straps and a subtle bias cut make it ideal for summer evenings or layered under a blazer.' },
  { id:3,  name:'Wool Longline Coat',        cat:'Women', sub:'Outerwear', price:389, sale:null, sizes:['XS','S','M','L'],         colors:['Camel','Black'],         badge:null,     img:'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=1000&fit=crop&q=80', tags:['coat','wool','winter','outerwear'],                       desc:'An investment piece. Heavyweight wool blend, falls below the knee with a clean single-button fastening and structured shoulders.' },
  { id:4,  name:'Wide Leg Trousers',         cat:'Women', sub:'Trousers',  price:135, sale:98,   sizes:['XS','S','M','L','XL'],   colors:['Ecru','Black','Navy'],   badge:'Sale',   img:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop&q=80', tags:['trousers','office','smart','casual'],                     desc:'High-waisted with a generous leg opening. Lightweight crepe fabric that falls with just the right amount of drape.' },
  { id:5,  name:'Ribbed Cashmere Sweater',   cat:'Women', sub:'Knitwear',  price:220, sale:null, sizes:['XS','S','M','L'],         colors:['Oat','Sage','Grey'],     badge:null,     img:'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=80', tags:['cashmere','knitwear','cosy','winter'],                    desc:'Pure Grade-A cashmere in a close-knit ribbed construction. Timeless in simplicity — designed to last for years.' },
  { id:6,  name:'Tailored Midi Skirt',       cat:'Women', sub:'Skirts',    price:155, sale:null, sizes:['XS','S','M','L'],         colors:['Black','Camel'],         badge:null,     img:'https://images.unsplash.com/photo-1583496661160-fb5218a5a0f2?w=800&h=1000&fit=crop&q=80', tags:['skirt','midi','tailored','office','smart'],               desc:'A perfectly weighted midi skirt with a hidden zip and subtle kick pleat. The clean A-line silhouette works from office to evening.' },
  { id:7,  name:'Cotton Poplin Shirt',       cat:'Women', sub:'Tops',      price:95,  sale:null, sizes:['XS','S','M','L','XL'],   colors:['White','Blue'],          badge:null,     img:'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&h=1000&fit=crop&q=80', tags:['shirt','cotton','casual','workwear'],                     desc:'A true wardrobe staple in crisp cotton poplin. Relaxed but structured enough to wear tucked or untucked.' },
  { id:8,  name:'Satin Wrap Blouse',         cat:'Women', sub:'Tops',      price:110, sale:79,   sizes:['XS','S','M','L'],         colors:['Ivory','Forest'],        badge:'Sale',   img:'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&h=1000&fit=crop&q=80', tags:['blouse','satin','evening','elegant','wedding'],           desc:'A fluid wrap blouse in satin crepe with a V-neckline and long sleeves. Adjustable tie for a flattering fit.' },
  { id:9,  name:'Merino Roll Neck',          cat:'Men',   sub:'Knitwear',  price:165, sale:null, sizes:['S','M','L','XL','XXL'],   colors:['Oat','Charcoal','Sage'], badge:'New In', img:'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800&h=1000&fit=crop&q=80', tags:['knitwear','roll neck','winter','smart casual'],           desc:'Extra-fine merino wool in a classic roll neck. Featherlight yet insulating, smooth and non-itchy.' },
  { id:10, name:'Relaxed Chino',             cat:'Men',   sub:'Trousers',  price:120, sale:null, sizes:['28','30','32','34','36'], colors:['Stone','Navy','Khaki'],  badge:null,     img:'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=1000&fit=crop&q=80', tags:['chino','trousers','casual','smart casual'],               desc:'Cut in a relaxed, tapered fit from soft cotton twill. Bridges smart and casual with ease.' },
  { id:11, name:'Tailored Wool Blazer',      cat:'Men',   sub:'Blazers',   price:320, sale:null, sizes:['S','M','L','XL'],         colors:['Charcoal','Navy'],       badge:null,     img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop&q=80', tags:['blazer','wool','smart','wedding','formal'],               desc:'Single-breasted blazer in textured wool mix. Fully lined with notch lapels and working button cuffs.' },
  { id:12, name:'Classic Oxford Shirt',      cat:'Men',   sub:'Shirts',    price:85,  sale:59,   sizes:['S','M','L','XL','XXL'],   colors:['White','Blue','Pink'],   badge:'Sale',   img:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=1000&fit=crop&q=80', tags:['shirt','oxford','workwear','casual'],                     desc:'The quintessential Oxford shirt in soft breathable cotton. Slightly relaxed body, perfect tucked or open.' },
  { id:13, name:'Slim Selvedge Denim',       cat:'Men',   sub:'Denim',     price:175, sale:null, sizes:['28','30','32','34'],       colors:['Indigo','Black'],        badge:null,     img:'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=80', tags:['denim','jeans','casual','everyday'],                      desc:'Japanese selvedge denim in a slim, straight cut. Fades beautifully over time.' },
  { id:14, name:'Leather Bomber Jacket',     cat:'Men',   sub:'Outerwear', price:450, sale:null, sizes:['S','M','L','XL'],         colors:['Black','Tan'],           badge:'New In', img:'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop&q=80', tags:['jacket','leather','bomber','outerwear','casual'],         desc:'Full-grain leather in a classic bomber silhouette. Ribbed cuffs and collar in a matching tone.' },
  { id:15, name:'Structured Leather Tote',  cat:'Accessories', sub:'Bags',      price:280, sale:null, sizes:['One Size'], colors:['Black','Tan','Sage'],    badge:null,     img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop&q=80', tags:['bag','tote','leather','workwear','everyday'],             desc:'A generous structured tote in vegetable-tanned leather. Zip pocket, two slip pockets, dual straps.' },
  { id:16, name:'Wool Oversized Scarf',     cat:'Accessories', sub:'Scarves',   price:89,  sale:null, sizes:['One Size'], colors:['Oat','Grey','Sage'],      badge:null,     img:'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&h=1000&fit=crop&q=80', tags:['scarf','wool','winter','cosy'],                           desc:'Oversized in proportion, understated in colour. Brushed wool blend for the softest hand feel.' },
  { id:17, name:'Leather Belt',             cat:'Accessories', sub:'Belts',     price:65,  sale:null, sizes:['S','M','L'],  colors:['Black','Tan'],            badge:null,     img:'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&h=1000&fit=crop&q=80', tags:['belt','leather','everyday','essential'],                  desc:'Minimal clean-edge belt in full-grain leather with a brushed-gold buckle.' },
  { id:18, name:'Gold Hoop Earrings',       cat:'Accessories', sub:'Jewellery', price:55,  sale:null, sizes:['One Size'], colors:['Gold'],                   badge:'New In', img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=1000&fit=crop&q=80', tags:['earrings','gold','jewellery','wedding','evening','gift'],  desc:'Lightweight 18k gold-plated hoops. Effortless, elegant, always appropriate.' },
  { id:19, name:'Acetate Sunglasses',       cat:'Accessories', sub:'Eyewear',   price:120, sale:null, sizes:['One Size'], colors:['Black','Tortoise'],        badge:null,     img:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=1000&fit=crop&q=80', tags:['sunglasses','summer','eyewear','everyday'],               desc:'Oversized oval frame in polished acetate with UV400 lenses.' },
  { id:20, name:'Canvas Weekender Bag',     cat:'Accessories', sub:'Bags',      price:195, sale:null, sizes:['One Size'], colors:['Natural','Black'],         badge:null,     img:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=1000&fit=crop&q=80', tags:['bag','weekend','canvas','travel'],                         desc:'Generous overnight bag in waxed canvas with leather handles and base.' },
  { id:21, name:'Cashmere Beanie',          cat:'Accessories', sub:'Hats',      price:75,  sale:55,   sizes:['One Size'], colors:['Oat','Black','Sage'],     badge:'Sale',   img:'https://images.unsplash.com/photo-1511095560988-2f0a6ece7a4c?w=800&h=1000&fit=crop&q=80', tags:['beanie','cashmere','winter','cosy','gift'],                desc:'A slouchy beanie in Grade-A cashmere. Simple, warm, luxuriously soft.' },
  { id:22, name:'Silk Hair Scarf',          cat:'Accessories', sub:'Hair',      price:45,  sale:null, sizes:['One Size'], colors:['Ivory','Sage','Black'],   badge:'New In', img:'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&h=1000&fit=crop&q=80', tags:['scarf','silk','summer','gift'],                            desc:'100% pure silk square. Wear in hair, around neck, on a bag, or as a belt.' },
];

const SUGGESTIONS = ["Something elegant for a summer wedding","Casual outfit for a man under $150","Smart work looks for a new job","Cosy winter weekend clothes","Gifts for her under $100","What to wear on a first date?","Going out look that isn't a dress","Travel capsule wardrobe essentials"];

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return y;
}

// ─── Utilities ────────────────────────────────────────────────────────────────
const ghost = (x={}) => ({ background:'none', border:'none', cursor:'pointer', fontFamily:F.body, padding:0, ...x });
const focusStyle = `*:focus-visible { outline: 2px solid #7A9E7E !important; outline-offset: 2px; } * { box-sizing: border-box; }`;

// ─── Image with shimmer skeleton ──────────────────────────────────────────────
function SImg({ src, alt, style={} }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:C.fog }}>
      {!loaded && (
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(90deg, ${C.fog} 25%, #ececec 50%, ${C.fog} 75%)`, backgroundSize:'200% 100%', animation:'shimmer 1.6s infinite' }} />
      )}
      <img src={src} alt={alt} onLoad={() => setLoaded(true)} onError={e => { e.target.style.opacity=0; setLoaded(true); }}
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', opacity: loaded ? 1 : 0, transition:'opacity 0.35s', ...style }} />
    </div>
  );
}

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, []);
  return (
    <div role="status" aria-live="polite"
      style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', background:C.black, color:C.white, padding:'12px 22px', fontFamily:F.body, fontSize:12, letterSpacing:'0.08em', zIndex:400, display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 24px rgba(0,0,0,0.22)', animation:'toastIn 0.3s ease', whiteSpace:'nowrap' }}>
      <div style={{ width:7, height:7, borderRadius:'50%', background:C.sage, flexShrink:0 }} />
      {msg}
    </div>
  );
}

// ─── Back to top ──────────────────────────────────────────────────────────────
function BackToTop({ visible }) {
  if (!visible) return null;
  return (
    <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} aria-label="Back to top"
      style={{ position:'fixed', bottom:28, right:24, width:42, height:42, background:C.black, color:C.white, border:'none', cursor:'pointer', fontFamily:F.body, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', zIndex:150, boxShadow:'0 2px 12px rgba(0,0,0,0.18)', animation:'fadeIn 0.2s ease' }}>
      ↑
    </button>
  );
}

// ─── Shared global styles ─────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      ${focusStyle}
      @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      @keyframes toastIn { from{opacity:0;transform:translate(-50%,12px)} to{opacity:1;transform:translate(-50%,0)} }
      @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
      @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
      @keyframes menuIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #7A9E7E; outline-offset: 2px; }
    `}</style>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Nav({ setPage, cartItems, openCart, goToShop }) {
  const w = useWidth();
  const mob = w < 768;
  const count = cartItems.reduce((s,i)=>s+i.qty, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = (e) => { if(e.key==='Escape') setMenuOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  return (
    <>
      <nav style={{ position:'sticky', top:0, zIndex:100, background:C.white, borderBottom:`1px solid ${C.black}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:`0 ${mob?'20px':'32px'}`, display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>

          {mob ? (
            // Mobile nav
            <>
              <button onClick={() => setMenuOpen(o=>!o)} aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen}
                style={ghost({ fontSize:22, color:C.black, width:36, height:36, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5 })}>
                <div style={{ width:22, height:1.5, background:menuOpen?'transparent':C.black, transition:'all 0.2s', transform:menuOpen?'rotate(45deg) translate(4px,4px)':'none' }}/>
                <div style={{ width:22, height:1.5, background:C.black, transition:'all 0.2s', transform:menuOpen?'rotate(-45deg)':'none' }}/>
              </button>
              <button onClick={() => setPage('home')} style={ghost({ textAlign:'center', lineHeight:1 })}>
                <div style={{ fontFamily:F.display, fontSize:18, fontWeight:300, letterSpacing:'0.22em', color:C.black }}>MAGASIN</div>
                <div style={{ fontFamily:F.body, fontSize:6, fontWeight:500, letterSpacing:'0.28em', textTransform:'uppercase', color:C.sage, marginTop:2 }}>Collection</div>
              </button>
              <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                <button onClick={() => setPage('search')} aria-label="AI Search" style={ghost({ color:C.black, display:'flex', alignItems:'center' })}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:C.sage }}/>
                </button>
                <button onClick={openCart} aria-label={`Cart, ${count} items`}
                  style={ghost({ fontSize:11, letterSpacing:'0.08em', color:C.black, display:'flex', alignItems:'center', gap:5 })}>
                  Cart <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:18, height:18, borderRadius:'50%', background:count>0?C.black:C.border, color:count>0?C.white:C.slate, fontSize:9, fontWeight:500, transition:'background 0.2s' }}>{count}</span>
                </button>
              </div>
            </>
          ) : (
            // Desktop nav
            <>
              <div style={{ display:'flex', gap:28 }}>
                {['Women','Men','Accessories'].map(cat => (
                  <button key={cat} onClick={() => goToShop(cat)} style={ghost({ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:C.slate })}>{cat}</button>
                ))}
                <button onClick={() => goToShop('all')} style={ghost({ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:C.sage })}>Sale</button>
              </div>
              <button onClick={() => setPage('home')} style={ghost({ textAlign:'center', lineHeight:1 })}>
                <div style={{ fontFamily:F.display, fontSize:22, fontWeight:300, letterSpacing:'0.22em', color:C.black }}>MAGASIN</div>
                <div style={{ fontFamily:F.body, fontSize:7, fontWeight:500, letterSpacing:'0.28em', textTransform:'uppercase', color:C.sage, marginTop:2 }}>Collection</div>
              </button>
              <div style={{ display:'flex', gap:22, alignItems:'center' }}>
                <button onClick={() => setPage('search')} style={ghost({ fontSize:11, letterSpacing:'0.08em', color:C.black, display:'flex', alignItems:'center', gap:6 })}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:C.sage }}/>AI Search
                </button>
                <button onClick={openCart} aria-label={`Cart, ${count} items`}
                  style={ghost({ fontSize:11, letterSpacing:'0.08em', color:C.black, display:'flex', alignItems:'center', gap:6 })}>
                  Cart <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:18, height:18, borderRadius:'50%', background:count>0?C.black:C.border, color:count>0?C.white:C.slate, fontSize:9, fontWeight:500, transition:'background 0.2s' }}>{count}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {mob && menuOpen && (
        <div role="dialog" aria-label="Navigation menu"
          style={{ position:'fixed', top:64, left:0, right:0, background:C.white, borderBottom:`1px solid ${C.black}`, zIndex:99, padding:'20px 24px 28px', animation:'menuIn 0.2s ease' }}>
          {[['Women','Women'],['Men','Men'],['Accessories','Accessories'],['Sale — selected pieces reduced','all']].map(([label, cat]) => (
            <button key={label} onClick={() => { goToShop(cat); setMenuOpen(false); }}
              style={ghost({ display:'block', width:'100%', textAlign:'left', fontFamily:F.display, fontSize:26, fontWeight:300, color:C.black, padding:'10px 0', borderBottom:`0.5px solid ${C.border}` })}>
              {label}
            </button>
          ))}
          <button onClick={() => { setPage('search'); setMenuOpen(false); }}
            style={ghost({ display:'flex', alignItems:'center', gap:8, marginTop:16, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:C.sageDark })}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:C.sage }}/> AI Style Search
          </button>
        </div>
      )}
    </>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
function CartDrawer({ items, onClose, onUpdateQty, onRemove }) {
  const w = useWidth();
  const mob = w < 640;
  const total = items.reduce((s,i)=>s+(i.sale||i.price)*i.qty, 0);
  const count = items.reduce((s,i)=>s+i.qty, 0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = (e) => { if(e.key==='Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => { document.body.style.overflow=''; document.removeEventListener('keydown', h); };
  }, []);

  return (
    <>
      <div onClick={onClose} aria-hidden="true"
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:200 }}/>
      <div role="dialog" aria-modal="true" aria-label="Shopping cart"
        style={{ position:'fixed', top:0, right:0, bottom:0, width: mob ? '100vw' : 420, background:C.white, zIndex:201, display:'flex', flexDirection:'column', boxShadow:'-8px 0 32px rgba(0,0,0,0.12)', animation:'slideIn 0.28s ease' }}>
        <div style={{ padding:'24px 28px 20px', borderBottom:`0.5px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
          <div>
            <div style={{ fontFamily:F.display, fontSize:28, fontWeight:300, color:C.black }}>Your Cart</div>
            {count>0 && <div style={{ fontFamily:F.body, fontSize:11, color:C.slate, marginTop:2 }}>{count} {count===1?'item':'items'}</div>}
          </div>
          <button onClick={onClose} aria-label="Close cart" style={ghost({ fontSize:24, color:C.slate, lineHeight:1 })}>×</button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'0 28px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign:'center', paddingTop:80 }}>
              <div style={{ width:48, height:48, border:`0.5px solid ${C.border}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:20, color:C.slate }}>∅</div>
              <div style={{ fontFamily:F.display, fontSize:26, fontWeight:300, marginBottom:10 }}>Your cart is empty</div>
              <div style={{ fontFamily:F.body, fontSize:13, fontWeight:300, color:C.slate, lineHeight:1.6 }}>Add something beautiful<br/>to get started.</div>
              <button onClick={onClose} style={{ marginTop:28, background:C.black, color:C.white, border:'none', padding:'12px 28px', fontFamily:F.body, fontSize:11, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer' }}>Continue Shopping</button>
            </div>
          ) : items.map((item, idx) => (
            <div key={idx} style={{ display:'grid', gridTemplateColumns:'88px 1fr', gap:16, padding:'20px 0', borderBottom:`0.5px solid ${C.border}` }}>
              <div style={{ height:110, overflow:'hidden' }}>
                <SImg src={item.img} alt={item.name}/>
              </div>
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontFamily:F.body, fontSize:9, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:C.sage, marginBottom:3 }}>{item.cat}</div>
                  <div style={{ fontFamily:F.display, fontSize:17, fontWeight:400, color:C.black, lineHeight:1.2, marginBottom:5 }}>{item.name}</div>
                  <div style={{ fontFamily:F.body, fontSize:11, color:C.slate }}>
                    {item.selColor && <span>{item.selColor}</span>}
                    {item.selColor && item.selSize && item.selSize!=='One Size' && <span style={{ margin:'0 5px', opacity:0.3 }}>|</span>}
                    {item.selSize && item.selSize!=='One Size' && <span>Size {item.selSize}</span>}
                    {item.selSize==='One Size' && !item.selColor && <span>One Size</span>}
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
                  <div style={{ display:'inline-flex', alignItems:'center', border:`0.5px solid ${C.border}` }}>
                    <button onClick={() => onUpdateQty(idx, item.qty-1)} aria-label="Decrease quantity"
                      style={ghost({ width:30, height:30, fontSize:18, color:C.slate, display:'flex', alignItems:'center', justifyContent:'center' })}>−</button>
                    <span style={{ fontFamily:F.body, fontSize:12, width:26, textAlign:'center' }} aria-label={`Quantity: ${item.qty}`}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(idx, item.qty+1)} aria-label="Increase quantity"
                      style={ghost({ width:30, height:30, fontSize:16, color:C.slate, display:'flex', alignItems:'center', justifyContent:'center' })}>+</button>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <span style={{ fontFamily:F.body, fontSize:14, fontWeight:500 }}>${((item.sale||item.price)*item.qty).toFixed(0)}</span>
                    <button onClick={() => onRemove(idx)} aria-label={`Remove ${item.name} from cart`}
                      style={ghost({ fontSize:18, color:'#C8C8C8', lineHeight:1 })}>×</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div style={{ padding:'20px 28px 28px', borderTop:`0.5px solid ${C.border}` }}>
            {total < 150 ? (
              <div style={{ marginBottom:18, padding:'12px 14px', background:C.sageLight, borderRadius:2 }}>
                <div style={{ fontFamily:F.body, fontSize:11, color:C.sageDark, marginBottom:8 }}>Add <strong>${(150-total).toFixed(0)}</strong> more for free shipping</div>
                <div style={{ height:2, background:'#D0E4D0', borderRadius:1 }}>
                  <div style={{ height:'100%', width:`${Math.min((total/150)*100,100)}%`, background:C.sage, borderRadius:1, transition:'width 0.4s' }}/>
                </div>
              </div>
            ) : (
              <div style={{ marginBottom:18, padding:'10px 14px', background:C.sageLight, borderRadius:2, display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:C.sage }}/><div style={{ fontFamily:F.body, fontSize:11, color:C.sageDark }}>You qualify for free shipping</div>
              </div>
            )}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
              <span style={{ fontFamily:F.body, fontSize:13, color:C.slate }}>Subtotal</span>
              <span style={{ fontFamily:F.display, fontSize:22, fontWeight:300, color:C.black }}>${total.toFixed(0)}</span>
            </div>
            <div style={{ fontFamily:F.body, fontSize:11, color:C.slate, marginBottom:22 }}>Taxes and shipping calculated at checkout</div>
            <button style={{ width:'100%', background:C.black, color:C.white, border:'none', padding:'15px', fontFamily:F.body, fontSize:11, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer', marginBottom:10 }}>
              Proceed to Checkout
            </button>
            <button onClick={onClose} style={{ width:'100%', background:C.white, color:C.black, border:`1px solid ${C.black}`, padding:'15px', fontFamily:F.body, fontSize:11, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function PCard({ product, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <article onClick={() => onClick(product)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&onClick(product)} aria-label={`View ${product.name}, $${product.sale||product.price}`}
      style={{ cursor:'pointer', border:`0.5px solid ${C.border}`, transition:'box-shadow 0.2s', boxShadow:hov?'0 4px 20px rgba(0,0,0,0.08)':'none', outline:'none' }}>
      <div style={{ height:300, background:C.fog, position:'relative', overflow:'hidden' }}>
        <SImg src={product.img} alt={product.name} style={{ transform:hov?'scale(1.04)':'scale(1)', transition:'transform 0.4s ease' }}/>
        {product.badge && <div style={{ position:'absolute', top:12, left:12, background:product.badge==='Sale'?C.sage:C.black, color:C.white, fontFamily:F.body, fontSize:9, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', padding:'4px 9px' }}>{product.badge}</div>}
      </div>
      <div style={{ padding:'12px 14px 16px' }}>
        <div style={{ fontFamily:F.body, fontSize:9, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', color:C.sage, marginBottom:4 }}>{product.cat} · {product.sub}</div>
        <div style={{ fontFamily:F.display, fontSize:18, fontWeight:400, color:C.black, marginBottom:8, lineHeight:1.2 }}>{product.name}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <span style={{ fontFamily:F.body, fontSize:13, color:C.black }}>${product.sale||product.price}</span>
            {product.sale && <span style={{ fontFamily:F.body, fontSize:11, color:C.slate, textDecoration:'line-through', marginLeft:6 }}>${product.price}</span>}
          </div>
          <div style={{ display:'flex', gap:4 }} aria-label={`Available in: ${product.colors.join(', ')}`}>
            {product.colors.map(c=><div key={c} title={c} style={{ width:10, height:10, borderRadius:'50%', background:CM[c]||'#ccc', border:`0.5px solid ${C.border}` }}/>)}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop:`0.5px solid ${C.border}`, padding:'48px 24px', textAlign:'center', marginTop:80 }}>
      <div style={{ fontFamily:F.display, fontSize:26, fontWeight:300, letterSpacing:'0.22em', color:C.black, marginBottom:6 }}>MAGASIN</div>
      <div style={{ fontFamily:F.body, fontSize:8, fontWeight:500, letterSpacing:'0.3em', textTransform:'uppercase', color:C.sage, marginBottom:20 }}>Collection</div>
      <div style={{ display:'flex', justifyContent:'center', gap:20, marginBottom:20, flexWrap:'wrap' }}>
        {['Shipping & Returns','Size Guide','Care Instructions','About Us','Contact'].map(l=>(
          <button key={l} style={ghost({ fontSize:11, color:C.slate })}>{l}</button>
        ))}
      </div>
      <div style={{ fontFamily:F.body, fontSize:11, color:'#C8C8C8' }}>© 2025 Magasin Collection. All rights reserved.</div>
    </footer>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ goToShop, goToProduct, setPage }) {
  const w = useWidth();
  const mob = w < 640;
  const tab = w < 1024;

  return (
    <main>
      {/* Hero */}
      <section aria-label="Hero" style={{ position:'relative', height: mob?400:600, overflow:'hidden', background:C.fog }}>
        <SImg src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&h=700&fit=crop&q=80" alt="Woman in elegant white outfit — The New Collection"/>
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.22)', display:'flex', alignItems:'flex-end', padding: mob?'36px 28px':'64px 80px' }}>
          <div>
            <div style={{ fontFamily:F.body, fontSize:10, fontWeight:500, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)', marginBottom:14 }}>Spring / Summer 2025</div>
            <div style={{ fontFamily:F.display, fontSize: mob?44:72, fontWeight:300, color:C.white, lineHeight:1.0, marginBottom: mob?22:30 }}>The New<br/>Collection</div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button onClick={()=>goToShop('all')} style={{ background:C.white, color:C.black, border:'none', padding:`${mob?'12px':'15px'} ${mob?'24px':'36px'}`, fontFamily:F.body, fontSize:11, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer' }}>Shop Now</button>
              <button onClick={()=>setPage('search')} style={{ background:'transparent', color:C.white, border:'1px solid rgba(255,255,255,0.55)', padding:`${mob?'12px':'15px'} ${mob?'16px':'24px'}`, fontFamily:F.body, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:C.sage }}/>{mob?'AI':'AI Search'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section aria-label="New Arrivals" style={{ maxWidth:1200, margin:'0 auto', padding: mob?'48px 20px':'72px 32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: mob?28:40 }}>
          <h2 style={{ fontFamily:F.display, fontSize: mob?28:38, fontWeight:300, margin:0 }}>New Arrivals</h2>
          <button onClick={()=>goToShop('all')} style={ghost({ fontSize:11, color:C.slate, textDecoration:'underline', textUnderlineOffset:4 })}>See all →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: mob?'repeat(2,1fr)':tab?'repeat(3,1fr)':'repeat(4,1fr)', gap: mob?12:20 }}>
          {PRODUCTS.filter(p=>p.badge==='New In').slice(0,4).map(p=><PCard key={p.id} product={p} onClick={goToProduct}/>)}
        </div>
      </section>

      {/* Categories */}
      <section aria-label="Shop by category" style={{ background:C.fog, padding: mob?'48px 0':'72px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding: mob?'0 20px':'0 32px' }}>
          <h2 style={{ fontFamily:F.display, fontSize: mob?28:38, fontWeight:300, textAlign:'center', marginBottom: mob?28:44 }}>Shop by Category</h2>
          <div style={{ display:'grid', gridTemplateColumns: mob?'1fr':tab?'repeat(3,1fr)':'repeat(3,1fr)', gap:16 }}>
            {[
              { label:'Women', img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=700&fit=crop&q=80' },
              { label:'Men', img:'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=600&h=700&fit=crop&q=80' },
              { label:'Accessories', img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=700&fit=crop&q=80' },
            ].map(cat=>(
              <div key={cat.label} onClick={()=>goToShop(cat.label)} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&goToShop(cat.label)}
                aria-label={`Shop ${cat.label}`}
                style={{ cursor:'pointer', position:'relative', height: mob?260:440, overflow:'hidden', background:C.border, outline:'none' }}>
                <SImg src={cat.img} alt={cat.label}/>
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.28)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', padding:28 }}>
                  <div style={{ fontFamily:F.display, fontSize: mob?28:36, fontWeight:300, color:C.white }}>{cat.label}</div>
                  <div style={{ fontFamily:F.body, fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.7)', marginTop:6 }}>{PRODUCTS.filter(p=>p.cat===cat.label).length} pieces</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Search promo */}
      <section aria-label="AI Search" style={{ background:C.black, padding: mob?'48px 24px':'60px 32px', textAlign:'center' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:18 }}>
          <div style={{ width:7, height:7, borderRadius:'50%', background:C.sage }}/><span style={{ fontFamily:F.body, fontSize:10, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', color:C.sage }}>AI Style Search</span>
        </div>
        <h2 style={{ fontFamily:F.display, fontSize: mob?30:40, fontWeight:300, color:C.white, marginBottom:14 }}>Not sure what you're looking for?</h2>
        <p style={{ fontFamily:F.body, fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.5)', marginBottom:28, maxWidth:460, margin:'0 auto 28px' }}>Describe an occasion, a feeling, or a budget — our AI stylist finds the right pieces.</p>
        <button onClick={()=>setPage('search')} style={{ background:C.white, color:C.black, border:'none', padding:'14px 36px', fontFamily:F.body, fontSize:11, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer' }}>Try AI Search</button>
      </section>

      {/* Sale */}
      <section aria-label="Sale" style={{ maxWidth:1200, margin:'0 auto', padding: mob?'48px 20px':'72px 32px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: mob?28:40 }}>
          <div>
            <h2 style={{ fontFamily:F.display, fontSize: mob?28:38, fontWeight:300, margin:0 }}>On Sale</h2>
            <div style={{ fontFamily:F.display, fontSize:16, fontStyle:'italic', fontWeight:300, color:C.sage, marginTop:4 }}>Selected pieces, reduced</div>
          </div>
          <button onClick={()=>goToShop('all')} style={ghost({ fontSize:11, color:C.slate, textDecoration:'underline', textUnderlineOffset:4 })}>See all →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns: mob?'repeat(2,1fr)':tab?'repeat(3,1fr)':'repeat(4,1fr)', gap: mob?12:20 }}>
          {PRODUCTS.filter(p=>p.badge==='Sale').map(p=><PCard key={p.id} product={p} onClick={goToProduct}/>)}
        </div>
      </section>
      <Footer/>
    </main>
  );
}

// ─── Shop Page ────────────────────────────────────────────────────────────────
function ShopPage({ filters, setFilters, goToProduct, sortBy, setSortBy }) {
  const w = useWidth();
  const mob = w < 768;
  const [filterOpen, setFilterOpen] = useState(false);

  const allSizes = [...new Set(PRODUCTS.flatMap(p=>p.sizes))].filter(s=>s!=='One Size');
  const allColors = [...new Set(PRODUCTS.flatMap(p=>p.colors))];
  const tog = (key,val) => setFilters(f=>({...f,[key]:f[key].includes(val)?f[key].filter(x=>x!==val):[...f[key],val]}));
  const clearable = filters.category!=='all'||filters.maxPrice<500||filters.sizes.length||filters.colors.length;
  const lbl = { fontFamily:F.body, fontSize:10, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:C.black, marginBottom:14 };

  const filtered = useMemo(()=>{
    let p=[...PRODUCTS];
    if(filters.category!=='all') p=p.filter(x=>x.cat===filters.category);
    p=p.filter(x=>(x.sale||x.price)<=filters.maxPrice);
    if(filters.sizes.length) p=p.filter(x=>filters.sizes.some(s=>x.sizes.includes(s)));
    if(filters.colors.length) p=p.filter(x=>filters.colors.some(c=>x.colors.includes(c)));
    if(sortBy==='price-asc') p.sort((a,b)=>(a.sale||a.price)-(b.sale||b.price));
    if(sortBy==='price-desc') p.sort((a,b)=>(b.sale||b.price)-(a.sale||a.price));
    return p;
  },[filters,sortBy]);

  const FilterPanel = () => (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={lbl}>Category</div>
        {['all','Women','Men','Accessories'].map(cat=>(
          <button key={cat} onClick={()=>setFilters(f=>({...f,category:cat}))}
            style={ghost({ display:'block', textAlign:'left', fontSize:13, fontWeight:filters.category===cat?500:300, color:filters.category===cat?C.black:C.slate, marginBottom:10, paddingLeft:10, borderLeft:filters.category===cat?`2px solid ${C.sage}`:'2px solid transparent', transition:'all 0.15s', width:'100%' })}>
            {cat==='all'?'All':cat} ({cat==='all'?PRODUCTS.length:PRODUCTS.filter(p=>p.cat===cat).length})
          </button>
        ))}
      </div>
      <div style={{ marginBottom:32 }}>
        <div style={lbl}>Max Price</div>
        <input type="range" min={45} max={500} value={filters.maxPrice} step={5} onChange={e=>setFilters(f=>({...f,maxPrice:Number(e.target.value)}))} style={{ width:'100%', accentColor:C.sage }} aria-label="Maximum price filter"/>
        <div style={{ fontFamily:F.body, fontSize:12, color:C.slate, marginTop:8 }}>Up to ${filters.maxPrice}</div>
      </div>
      <div style={{ marginBottom:32 }}>
        <div style={lbl}>Size</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {allSizes.map(sz=>{const on=filters.sizes.includes(sz);return(
            <button key={sz} onClick={()=>tog('sizes',sz)} aria-pressed={on} aria-label={`Size ${sz}`}
              style={ghost({ minWidth:34, height:34, padding:'0 6px', display:'flex', alignItems:'center', justifyContent:'center', border:on?`1.5px solid ${C.black}`:`0.5px solid ${C.border}`, background:on?C.black:C.white, color:on?C.white:C.slate, fontSize:10, transition:'all 0.15s' })}>{sz}</button>
          );})}
        </div>
      </div>
      <div style={{ marginBottom:32 }}>
        <div style={lbl}>Colour</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {allColors.map(col=>{const on=filters.colors.includes(col);return(
            <button key={col} onClick={()=>tog('colors',col)} aria-pressed={on} aria-label={`Colour: ${col}`}
              style={ghost({ width:24, height:24, borderRadius:'50%', background:CM[col]||'#ccc', border:on?`2.5px solid ${C.black}`:`0.5px solid ${C.border}`, transition:'border 0.15s' })}/>
          );})}
        </div>
      </div>
      {clearable && <button onClick={()=>setFilters({category:'all',maxPrice:500,sizes:[],colors:[]})} style={ghost({ fontSize:11, color:C.slate, textDecoration:'underline', textUnderlineOffset:3 })}>Clear all filters</button>}
    </div>
  );

  return (
    <main style={{ maxWidth:1200, margin:'0 auto', padding: mob?'28px 20px':'36px 32px' }}>
      {/* Header */}
      <div style={{ marginBottom:28, paddingBottom:20, borderBottom:`0.5px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:12, flexWrap:'wrap' }}>
        <div>
          <div style={{ fontFamily:F.body, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:C.slate, marginBottom:6 }}>{filters.category==='all'?'All Products':filters.category}</div>
          <h1 style={{ fontFamily:F.display, fontSize: mob?28:38, fontWeight:300, margin:0 }}>{filters.category==='all'?'Shop All':filters.category}</h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontFamily:F.body, fontSize:11, color:C.slate }}>{filtered.length} items</span>
          {mob && (
            <button onClick={()=>setFilterOpen(true)}
              style={{ fontFamily:F.body, fontSize:11, fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', padding:'8px 16px', border:`0.5px solid ${C.border}`, background:clearable?C.black:C.white, color:clearable?C.white:C.black, cursor:'pointer', borderRadius:2 }}>
              Filter {clearable&&'•'}
            </button>
          )}
          <select value={sortBy} onChange={e=>setSortBy(e.target.value)} aria-label="Sort products"
            style={{ fontFamily:F.body, fontSize:11, border:`0.5px solid ${C.border}`, padding:'9px 14px', background:C.white, color:C.black, cursor:'pointer', outline:'none' }}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Desktop: sidebar + grid | Mobile: just grid */}
      <div style={{ display:'grid', gridTemplateColumns: mob?'1fr':'200px 1fr', gap: mob?0:48 }}>
        {!mob && <aside aria-label="Product filters"><FilterPanel/></aside>}
        <div>
          {filtered.length===0
            ? <div style={{ textAlign:'center', padding:'80px 0' }}>
                <div style={{ fontFamily:F.display, fontSize:28, fontWeight:300, marginBottom:10 }}>No products found</div>
                <div style={{ fontFamily:F.body, fontSize:13, color:C.slate }}>Try adjusting or clearing your filters</div>
              </div>
            : <div style={{ display:'grid', gridTemplateColumns: mob?'repeat(2,1fr)':'repeat(3,1fr)', gap: mob?12:18 }}>
                {filtered.map(p=><PCard key={p.id} product={p} onClick={goToProduct}/>)}
              </div>
          }
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mob && filterOpen && (
        <>
          <div onClick={()=>setFilterOpen(false)} aria-hidden="true" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:200 }}/>
          <div role="dialog" aria-modal="true" aria-label="Filter products"
            style={{ position:'fixed', bottom:0, left:0, right:0, background:C.white, zIndex:201, padding:'28px 24px', borderRadius:'12px 12px 0 0', maxHeight:'80vh', overflowY:'auto', animation:'slideUp 0.3s ease', boxShadow:'0 -4px 24px rgba(0,0,0,0.12)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <div style={{ fontFamily:F.display, fontSize:22, fontWeight:300 }}>Filter</div>
              <button onClick={()=>setFilterOpen(false)} aria-label="Close filters" style={ghost({ fontSize:22, color:C.slate })}>×</button>
            </div>
            <FilterPanel/>
            <button onClick={()=>setFilterOpen(false)} style={{ width:'100%', background:C.black, color:C.white, border:'none', padding:'14px', fontFamily:F.body, fontSize:11, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', cursor:'pointer', marginTop:8 }}>
              View {filtered.length} results
            </button>
          </div>
        </>
      )}
    </main>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────
function DetailPage({ product, goToShop, goToProduct, addToCart, openCart }) {
  const w = useWidth();
  const mob = w < 768;
  const [selSize, setSelSize] = useState(null);
  const [selColor, setSelColor] = useState(product.colors[0]);
  const [added, setAdded] = useState(false);
  const related = PRODUCTS.filter(p=>p.cat===product.cat&&p.id!==product.id).slice(0,4);

  const handleAdd = () => {
    if(!selSize&&product.sizes[0]!=='One Size') return;
    addToCart({...product, selSize:product.sizes[0]==='One Size'?'One Size':selSize, selColor});
    setAdded(true);
    setTimeout(()=>setAdded(false),2200);
    setTimeout(()=>openCart(),400);
  };

  return (
    <main>
      <div style={{ maxWidth:1200, margin:'0 auto', padding: mob?'24px 20px':'32px 32px' }}>
        <nav aria-label="Breadcrumb" style={{ fontFamily:F.body, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:C.slate, marginBottom: mob?24:36 }}>
          <button onClick={()=>goToShop('home')} style={ghost({ fontSize:10, color:C.slate, textDecoration:'underline' })}>Home</button>
          {' / '}
          <button onClick={()=>goToShop(product.cat)} style={ghost({ fontSize:10, color:C.slate, textDecoration:'underline' })}>{product.cat}</button>
          {' / '}
          <span style={{ color:C.black }}>{product.name}</span>
        </nav>

        <div style={{ display:'grid', gridTemplateColumns: mob?'1fr':'1fr 1fr', gap: mob?28:64, marginBottom:80 }}>
          {/* Image */}
          <div style={{ background:C.fog, aspectRatio: mob?'3/2':'4/5', overflow:'hidden', position:'relative' }}>
            <SImg src={product.img} alt={product.name}/>
            {product.badge && <div style={{ position:'absolute', top:16, left:16, background:product.badge==='Sale'?C.sage:C.black, color:C.white, fontFamily:F.body, fontSize:9, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', padding:'5px 10px' }}>{product.badge}</div>}
          </div>

          {/* Info */}
          <div style={{ paddingTop: mob?0:8 }}>
            <div style={{ fontFamily:F.body, fontSize:10, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', color:C.sage, marginBottom:10 }}>{product.cat} · {product.sub}</div>
            <h1 style={{ fontFamily:F.display, fontSize: mob?36:46, fontWeight:300, lineHeight:1.05, color:C.black, marginBottom:16, marginTop:0 }}>{product.name}</h1>
            <div style={{ marginBottom:28 }}>
              <span style={{ fontFamily:F.body, fontSize:22, color:C.black }}>${product.sale||product.price}</span>
              {product.sale&&<span style={{ fontFamily:F.body, fontSize:16, color:C.slate, textDecoration:'line-through', marginLeft:10 }}>${product.price}</span>}
            </div>
            <p style={{ fontFamily:F.body, fontSize:14, fontWeight:300, lineHeight:1.8, color:C.slate, marginBottom:32, marginTop:0 }}>{product.desc}</p>

            {/* Colour */}
            <fieldset style={{ border:'none', padding:0, marginBottom:24, marginLeft:0 }}>
              <legend style={{ fontFamily:F.body, fontSize:10, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:C.black, marginBottom:12 }}>
                Colour — <span style={{ fontWeight:300, letterSpacing:'normal', textTransform:'none' }}>{selColor}</span>
              </legend>
              <div style={{ display:'flex', gap:10 }}>
                {product.colors.map(c=>(
                  <button key={c} onClick={()=>setSelColor(c)} aria-pressed={selColor===c} aria-label={`Select colour ${c}`}
                    style={ghost({ width:28, height:28, borderRadius:'50%', background:CM[c]||'#ccc', border:selColor===c?`2.5px solid ${C.black}`:`0.5px solid ${C.border}` })}/>
                ))}
              </div>
            </fieldset>

            {/* Size */}
            {product.sizes[0]!=='One Size' && (
              <fieldset style={{ border:'none', padding:0, marginBottom:32, marginLeft:0 }}>
                <legend style={{ fontFamily:F.body, fontSize:10, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:C.black, marginBottom:12 }}>
                  Size {!selSize&&<span style={{ color:C.sage, fontWeight:300, letterSpacing:'normal', textTransform:'none', fontSize:11 }}>— please select</span>}
                </legend>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {product.sizes.map(sz=>(
                    <button key={sz} onClick={()=>setSelSize(sz)} aria-pressed={selSize===sz} aria-label={`Size ${sz}`}
                      style={ghost({ width:46, height:46, display:'flex', alignItems:'center', justifyContent:'center', border:selSize===sz?`1.5px solid ${C.black}`:`0.5px solid ${C.border}`, background:selSize===sz?C.black:C.white, color:selSize===sz?C.white:C.slate, fontSize:11, transition:'all 0.15s' })}>
                      {sz}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <button onClick={handleAdd} aria-label={`Add ${product.name} to cart`}
              style={{ width:'100%', background:added?C.sage:C.black, color:C.white, border:'none', padding:'16px', fontFamily:F.body, fontSize:12, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer', marginBottom:12, transition:'background 0.3s' }}>
              {added ? '✓ Added — View Cart' : 'Add to Cart'}
            </button>
            <button style={{ width:'100%', background:C.white, color:C.black, border:`1px solid ${C.black}`, padding:'16px', fontFamily:F.body, fontSize:12, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer' }}>Save to Wishlist</button>

            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:24 }}>
              {product.tags.map(t=><span key={t} style={{ fontFamily:F.body, fontSize:10, letterSpacing:'0.08em', padding:'4px 10px', background:C.sageLight, color:C.sageDark, borderRadius:2 }}>{t}</span>)}
            </div>
            <div style={{ marginTop:32, paddingTop:22, borderTop:`0.5px solid ${C.border}` }}>
              {[['Free shipping','On orders over $150'],['Free returns','Within 30 days'],['Sustainably made','Responsible materials']].map(([t,d])=>(
                <div key={t} style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ fontFamily:F.body, fontSize:12, fontWeight:500, color:C.black }}>{t}</span>
                  <span style={{ fontFamily:F.body, fontSize:12, color:C.slate }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length>0&&(
          <section aria-label="You may also like">
            <h2 style={{ fontFamily:F.display, fontSize: mob?24:32, fontWeight:300, marginBottom:28 }}>You May Also Like</h2>
            <div style={{ display:'grid', gridTemplateColumns: mob?'repeat(2,1fr)':'repeat(4,1fr)', gap: mob?12:18 }}>
              {related.map(p=><PCard key={p.id} product={p} onClick={goToProduct}/>)}
            </div>
          </section>
        )}
      </div>
      <Footer/>
    </main>
  );
}

// ─── AI Search Page ───────────────────────────────────────────────────────────
function SearchPage({ goToProduct }) {
  const w = useWidth();
  const mob = w < 640;
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [searched, setSearched] = useState('');
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  useEffect(()=>{ inputRef.current?.focus(); },[]);

  const CATALOG = PRODUCTS.map(p=>({ id:p.id, name:p.name, category:p.cat, subcategory:p.sub, price:p.sale||p.price, originalPrice:p.price, onSale:!!p.sale, colors:p.colors, sizes:p.sizes, tags:p.tags, description:p.desc }));

  const runSearch = async (q) => {
    const t=(q||query).trim(); if(!t) return;
    setLoading(true); setResults(null); setError(null); setSearched(t);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, system:`You are a personal stylist for MAGASIN COLLECTION, a minimalistic editorial luxury fashion store. Match the customer's request to the most suitable products.\n\nOUTPUT: Return ONLY a raw JSON array. No markdown, no backticks, no text outside the array.\nFormat: [{"id": 1, "reason": "One warm specific sentence why this fits the request."}]\nRules: 3-5 products max, genuine matches only, honour budgets, reason sounds like a real stylist. Return [] if nothing fits.`, messages:[{ role:'user', content:`Customer: "${t}"\n\nCatalog:\n${JSON.stringify(CATALOG,null,2)}\n\nReturn only the JSON array.` }] }) });
      const data = await res.json();
      if(data.error) throw new Error(data.error.message);
      const parsed = JSON.parse((data.content?.[0]?.text||'[]').replace(/```json|```/g,'').trim());
      setResults(parsed.map(m=>({...PRODUCTS.find(p=>p.id===m.id),reason:m.reason})).filter(p=>p?.id));
    } catch(e) { setError('Something went wrong with the search. Please try again.'); }
    finally { setLoading(false); }
  };

  const Dot = ({d}) => <div style={{ width:9, height:9, borderRadius:'50%', background:C.sage, animation:`mgP 1.3s ease-in-out ${d}s infinite alternate` }}/>;

  return (
    <main>
      <style>{`@keyframes mgP{from{opacity:.2;transform:scale(.7)}to{opacity:1;transform:scale(1.2)}}`}</style>
      <div style={{ maxWidth:860, margin:'0 auto', padding: mob?'40px 20px 32px':'64px 32px 40px' }}>
        <div style={{ textAlign:'center', marginBottom: mob?36:52 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.sageLight, padding:'6px 16px', borderRadius:2, marginBottom:20 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:C.sage }}/><span style={{ fontFamily:F.body, fontSize:10, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:C.sageDark }}>Powered by Claude AI</span>
          </div>
          <h1 style={{ fontFamily:F.display, fontSize: mob?38:56, fontWeight:300, lineHeight:1.05, color:C.black, marginBottom:12, marginTop:0 }}>What are you<br/>looking for?</h1>
          <p style={{ fontFamily:F.body, fontSize:14, fontWeight:300, color:C.slate, maxWidth:460, margin:'0 auto' }}>Describe an occasion, a mood, or a budget — our AI stylist will hand-pick the right pieces.</p>
        </div>
        <div style={{ position:'relative', borderBottom:`1.5px solid ${C.black}`, marginBottom:32 }}>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runSearch()}
            aria-label="Search for clothing and accessories"
            placeholder={mob?`"elegant summer wedding"…`:`Try "something elegant for a summer wedding under $200" …`}
            style={{ width:'100%', padding:'16px 80px 16px 0', fontFamily:F.body, fontSize: mob?14:16, fontWeight:300, border:'none', outline:'none', boxSizing:'border-box', color:C.black, background:'transparent' }}/>
          <button onClick={()=>runSearch()} aria-label="Search" style={ghost({ position:'absolute', right:0, bottom:12, fontSize:11, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:C.black })}>Search →</button>
        </div>
        {!results&&!loading&&!error&&(
          <div>
            <div style={{ fontFamily:F.body, fontSize:10, fontWeight:500, letterSpacing:'0.16em', textTransform:'uppercase', color:C.slate, marginBottom:12 }}>Try asking</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {SUGGESTIONS.map(s=><button key={s} onClick={()=>{setQuery(s);runSearch(s);}} style={{ fontFamily:F.body, fontSize:11, fontWeight:300, padding:'8px 14px', border:`0.5px solid ${C.border}`, background:C.white, color:C.slate, cursor:'pointer', borderRadius:2 }}>{s}</button>)}
            </div>
          </div>
        )}
        {loading&&(
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:22 }}><Dot d={0}/><Dot d={0.2}/><Dot d={0.4}/></div>
            <div style={{ fontFamily:F.display, fontSize:22, fontWeight:300, fontStyle:'italic', color:C.slate }}>Styling your results…</div>
            <div style={{ fontFamily:F.body, fontSize:12, color:'#C0C0C0', marginTop:8 }}>Reading your request and searching the collection</div>
          </div>
        )}
        {error&&!loading&&(
          <div style={{ textAlign:'center', padding:'60px 0' }} role="alert">
            <div style={{ fontFamily:F.body, fontSize:13, color:C.slate, marginBottom:16 }}>{error}</div>
            <button onClick={()=>runSearch()} style={{ fontFamily:F.body, fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:C.black, background:'none', border:`0.5px solid ${C.border}`, padding:'10px 20px', cursor:'pointer' }}>Try again</button>
          </div>
        )}
        {results&&!loading&&(
          <section aria-live="polite" aria-label="Search results" style={{ marginTop:44, paddingTop:36, borderTop:`0.5px solid ${C.border}` }}>
            <div style={{ marginBottom:32 }}>
              {results.length>0
                ?<><div style={{ fontFamily:F.display, fontSize:28, fontWeight:300, marginBottom:4 }}>{results.length} {results.length===1?'piece':'pieces'} selected for you</div><div style={{ fontFamily:F.display, fontSize:15, fontStyle:'italic', fontWeight:300, color:C.slate }}>for "{searched}"</div></>
                :<><div style={{ fontFamily:F.display, fontSize:26, fontWeight:300, marginBottom:8 }}>No matches found</div><div style={{ fontFamily:F.body, fontSize:13, color:C.slate }}>Try rephrasing, or browse the full collection.</div></>
              }
            </div>
            {results.length>0&&(
              <div style={{ display:'grid', gridTemplateColumns: mob?'1fr':'repeat(3,1fr)', gap:24 }}>
                {results.map(p=>(
                  <div key={p.id}>
                    <div onClick={()=>goToProduct(p)} role="button" tabIndex={0} onKeyDown={e=>e.key==='Enter'&&goToProduct(p)} aria-label={`View ${p.name}`} style={{ cursor:'pointer', border:`0.5px solid ${C.border}`, outline:'none' }}>
                      <div style={{ height:240, background:C.fog, position:'relative', overflow:'hidden' }}>
                        <SImg src={p.img} alt={p.name}/>
                        {p.badge&&<div style={{ position:'absolute', top:10, left:10, background:p.badge==='Sale'?C.sage:C.black, color:C.white, fontFamily:F.body, fontSize:9, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', padding:'3px 8px' }}>{p.badge}</div>}
                      </div>
                      <div style={{ padding:'10px 13px 13px' }}>
                        <div style={{ fontFamily:F.body, fontSize:9, fontWeight:500, letterSpacing:'0.18em', textTransform:'uppercase', color:C.sage, marginBottom:3 }}>{p.cat} · {p.sub}</div>
                        <div style={{ fontFamily:F.display, fontSize:16, fontWeight:400, color:C.black, lineHeight:1.2, marginBottom:6 }}>{p.name}</div>
                        <span style={{ fontFamily:F.body, fontSize:12, color:C.black }}>${p.sale||p.price}</span>
                        {p.sale&&<span style={{ fontFamily:F.body, fontSize:11, color:C.slate, textDecoration:'line-through', marginLeft:5 }}>${p.price}</span>}
                      </div>
                    </div>
                    <div style={{ background:C.sageLight, padding:'11px 13px', borderLeft:`2px solid ${C.sage}` }}>
                      <div style={{ fontFamily:F.body, fontSize:9, fontWeight:500, letterSpacing:'0.14em', textTransform:'uppercase', color:C.sage, marginBottom:5 }}>Why this matches</div>
                      <div style={{ fontFamily:F.body, fontSize:12, fontWeight:300, lineHeight:1.7, color:C.sageDark }}>{p.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ textAlign:'center', marginTop:40 }}>
              <button onClick={()=>{setResults(null);setError(null);setQuery('');setTimeout(()=>inputRef.current?.focus(),80);}} style={ghost({ fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:C.slate, textDecoration:'underline', textUnderlineOffset:4 })}>Search again</button>
            </div>
          </section>
        )}
      </div>
      <Footer/>
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MagasinStore() {
  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({ category:'all', maxPrice:500, sizes:[], colors:[] });
  const [sortBy, setSortBy] = useState('featured');
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const scrollY = useScrollY();

  useEffect(()=>{
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return ()=>document.head.removeChild(link);
  },[]);

  const goToProduct = (p) => { setSelectedProduct(p); setPage('product'); window.scrollTo(0,0); };
  const goToShop = (cat) => {
    if(cat==='home'){ setPage('home'); return; }
    setFilters(f=>({...f,category:cat})); setPage('shop'); window.scrollTo(0,0);
  };

  const addToCart = useCallback((item) => {
    setCartItems(curr => {
      const key = `${item.id}__${item.selSize}__${item.selColor}`;
      const exists = curr.find(c=>`${c.id}__${c.selSize}__${c.selColor}`===key);
      if(exists) return curr.map(c=>`${c.id}__${c.selSize}__${c.selColor}`===key?{...c,qty:c.qty+1}:c);
      return [...curr, {...item, qty:1}];
    });
    setToast(`${item.name} added to cart`);
  }, []);

  const updateQty = (idx, newQty) => {
    if(newQty<=0) setCartItems(c=>c.filter((_,i)=>i!==idx));
    else setCartItems(c=>c.map((item,i)=>i===idx?{...item,qty:newQty}:item));
  };
  const removeItem = (idx) => setCartItems(c=>c.filter((_,i)=>i!==idx));

  return (
    <div style={{ fontFamily:"'Jost', sans-serif", backgroundColor:C.white, color:C.black, minHeight:'100vh' }}>
      <GlobalStyles/>
      <Nav setPage={setPage} cartItems={cartItems} openCart={()=>setCartOpen(true)} goToShop={goToShop}/>
      {page==='home'    && <HomePage    goToShop={goToShop} goToProduct={goToProduct} setPage={setPage}/>}
      {page==='shop'    && <ShopPage    filters={filters} setFilters={setFilters} goToProduct={goToProduct} sortBy={sortBy} setSortBy={setSortBy}/>}
      {page==='product' && selectedProduct && <DetailPage product={selectedProduct} goToShop={goToShop} goToProduct={goToProduct} addToCart={addToCart} openCart={()=>setCartOpen(true)}/>}
      {page==='search'  && <SearchPage  goToProduct={goToProduct}/>}
      {cartOpen && <CartDrawer items={cartItems} onClose={()=>setCartOpen(false)} onUpdateQty={updateQty} onRemove={removeItem}/>}
      {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}
      <BackToTop visible={scrollY > 400}/>
    </div>
  );
}
