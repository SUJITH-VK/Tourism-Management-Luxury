import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Travel Assistant endpoint
  app.post('/api/ai-chat', async (req, res) => {
    const { message, history = [], contextData = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const systemInstruction = `You are Aura, the premier AI Travel Concierge for AuraVoyage — an elite, luxury tourism management and travel platform.
Your persona is sophisticated, warm, impeccably knowledgeable, and dedicated to curating extraordinary journeys.
You have instant access to our curated tour inventory:
1. "Misty Nilgiri Serenity" - Ooty, Tamil Nadu (3 Days / 2 Nights) - ₹8,499/person. Highlights: Doddabetta Peak, Pykara Falls, Nilgiri Mountain Toy Train, Heritage tea estate walk. Perfect for quick escapes, couples, weekenders.
2. "Princess of Hill Stations" - Kodaikanal, Tamil Nadu (4 Days / 3 Nights) - ₹11,999/person. Highlights: Kodai Lake boating, Coaker's Walk, Pillar Rocks, Pine Forests, Kurinji temple. Great for serene romantic retreats.
3. "Emerald Backwater Serenade" - Alleppey & Munnar, Kerala (5 Days / 4 Nights) - ₹18,999/person. Highlights: Luxury houseboat cruise, spice plantation tour, tea garden sunrise, Kathakali dance. Ideal for families and couples.
4. "Coffee Valleys & Waterfalls" - Coorg, Karnataka (3 Days / 2 Nights) - ₹9,499/person. Highlights: Abbey Falls, Raja's Seat, Dubare Elephant Camp, private coffee estate tasting.
5. "Sun, Sands & Heritage Trails" - Goa (4 Days / 3 Nights) - ₹14,500/person. Highlights: Private catamaran cruise, Old Goa Portuguese churches, spice farm lunch, Dudhsagar falls.
6. "Royal Rajputana Grandeur" - Jaipur, Udaipur & Jodhpur, Rajasthan (6 Days / 5 Nights) - ₹29,999/person. Highlights: Amber Fort royal ascent, Lake Pichola private boat, Mehrangarh night tour, desert camp with folk music.
7. "Snow Peaks & Solang Adventures" - Manali, Himachal Pradesh (5 Days / 4 Nights) - ₹16,999/person. Highlights: Solang Valley paragliding, Rohtang Pass snow drive, Old Manali cafe culture, Hadimba temple.
8. "Paradise on Earth: Heavenly Valleys" - Srinagar & Gulmarg, Kashmir (6 Days / 5 Nights) - ₹32,500/person. Highlights: Luxury Dal Lake Shikara, Gulmarg Gondola Phase 2, Pahalgam Betaab valley, saffron farms.
9. "Futuristic Oasis & Desert Safari" - Dubai, UAE (5 Days / 4 Nights) - ₹48,999/person. Highlights: Burj Khalifa 124th floor, VIP desert dune safari with BBQ, Marina yacht dinner, Miracle Garden.
10. "Gardens of the Lion City" - Singapore (4 Days / 3 Nights) - ₹54,000/person. Highlights: Marina Bay Sands SkyPark, Gardens by the Bay Light Show, Sentosa Island cable car, Universal Studios VIP.

User Context:
${contextData?.userName ? `User Name: ${contextData.userName}` : ''}
${contextData?.bookingsCount ? `User has ${contextData.bookingsCount} bookings on record.` : ''}
${contextData?.activeBooking ? `Upcoming Trip: ${JSON.stringify(contextData.activeBooking)}` : ''}

Key guidelines:
- Always format answers beautifully with markdown, bullet points, and clean highlights.
- If asked for recommendations under a specific budget (e.g., under ₹10,000), explicitly highlight "Misty Nilgiri Serenity (Ooty)" or "Coffee Valleys (Coorg)".
- If asked to compare destinations (e.g., Ooty vs. Kodaikanal), provide an insightful, structured comparison matrix covering vibe, best season, top attractions, travel time, and budget.
- For family trips, strongly recommend Kerala Backwaters or Rajasthan Royal Grandeur.
- Always include package price, duration, and key inclusions when discussing specific tours.
- Keep tone professional, welcoming, and high-end.`;

        // Format previous messages if any
        const formattedContents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            formattedContents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.content }],
            });
          }
        }
        formattedContents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || "I am here to assist with your luxury travel arrangements. How may I guide your next journey?";
        return res.json({ reply });
      } catch (err: any) {
        console.error('Gemini API error, using intelligent travel concierge fallback:', err.message);
        // Fall back to rule-based travel assistant below
      }
    }

    // Fallback intelligent domain assistant
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('under 10') || lower.includes('under ₹10') || lower.includes('under 10,000') || lower.includes('budget') || lower.includes('10000') || lower.includes('10k')) {
      reply = `### 🌟 Handpicked Luxury Under ₹10,000

Here are our top-rated, high-value experiential getaways under ₹10,000 per traveler:

1. **Misty Nilgiri Serenity (Ooty)** — **₹8,499 / person**
   - **Duration:** 3 Days / 2 Nights
   - **Highlights:** Heritage Nilgiri Mountain Toy Train, Pykara Lake boating, Doddabetta Peak, and private tea factory walking tasting.
   - **Inclusions:** 4-star boutique resort stay, daily gourmet breakfast, private cab transfers, certified guide.

2. **Coffee Valleys & Waterfalls (Coorg)** — **₹9,499 / person**
   - **Duration:** 3 Days / 2 Nights
   - **Highlights:** Misty plantation sunrise, Abbey Falls, Dubare Elephant sanctuary, and Raja’s Seat twilight spectacle.
   - **Inclusions:** Cottage amidst coffee flora, organic breakfast, all entry permits.

*Both tours have confirmed weekend departures with flexible cancellations.*`;
    } else if (lower.includes('compare') || (lower.includes('ooty') && lower.includes('kodaikanal'))) {
      reply = `### ⚖️ Ooty vs. Kodaikanal: The Royal Hill Station Comparison

| Feature | Ooty ("Queen of Hills") | Kodaikanal ("Princess of Hills") |
| :--- | :--- | :--- |
| **Atmosphere** | Vibrant colonial charm, vast tea gardens, bustling bazaars | Peaceful pine forests, misty lake-centric serenity |
| **Key Attractions** | Nilgiri Toy Train, Botanical Gardens, Doddabetta | Kodai Star Lake, Coaker's Walk, Pillar Rocks, Pine Forest |
| **Starting Rate** | **₹8,499** (3 Days / 2 Nights) | **₹11,999** (4 Days / 3 Nights) |
| **Best For** | Families, heritage lovers, quick weekend escapes | Couples, honeymooners, nature walks, quiet contemplation |
| **Ideal Months** | September through May | October through June |

**Recommendation:** Choose **Ooty** if you desire tea estate walks and heritage charm; choose **Kodaikanal** if you prefer cooler seclusion and tranquil lakeside walks.`;
    } else if (lower.includes('family') || lower.includes('parents') || lower.includes('children') || lower.includes('kids')) {
      reply = `### 👨‍👩‍👧‍👦 Top Recommended Family Tour Packages

Traveling with family requires comfort, smooth logistics, and engaging experiences across age groups. Here are our top 3 family-first packages:

1. **Emerald Backwater Serenade (Kerala - 5D/4N)** — **₹18,999 / person**
   - Private 2-bedroom luxury houseboat in Alleppey with personal chef.
   - Gentle spice garden walks, Kathakali cultural evening, tea museum in Munnar.
   - Zero-stress private chauffeur transport.

2. **Royal Rajputana Grandeur (Rajasthan - 6D/5N)** — **₹29,999 / person**
   - Majestic fort visits in Jaipur & Udaipur with engaging storytelling guides.
   - Desert sunset camel safari and royal puppet show for kids.
   - Stays in heritage havelis.

3. **Gardens of the Lion City (Singapore - 4D/3N)** — **₹54,000 / person**
   - World-class family attractions: Sentosa Island, Universal Studios VIP passes, and Gardens by the Bay Cloud Forest.`;
    } else if (lower.includes('hill station') || lower.includes('mountain') || lower.includes('snow')) {
      reply = `### 🏔️ Premier Mountain & Hill Station Expeditions

Escape the bustle with our highest-rated alpine sanctuaries:

- **Paradise on Earth (Kashmir - 6D/5N)** — **₹32,500/person**
  *Snow-capped peaks, Gulmarg Gondola Phase 2 ascent, Dal Lake luxury houseboats.*
- **Snow Peaks & Solang (Manali - 5D/4N)** — **₹16,999/person**
  *Rohtang snow drive, riverside glamping, paragliding, hot sulfur springs.*
- **Misty Nilgiri Serenity (Ooty - 3D/2N)** — **₹8,499/person**
  *Gentle rolling hills, toy train journey, tea plantations.*
- **Princess of Hills (Kodaikanal - 4D/3N)** — **₹11,999/person**
  *Misty viewpoints, star lake cycling, dense pine forest trails.*`;
    } else if (lower.includes('summarize') || lower.includes('my trip') || lower.includes('my booking')) {
      if (contextData?.activeBooking) {
        const b = contextData.activeBooking;
        reply = `### 🎫 Summary of Your Upcoming Journey

- **Tour Package:** ${b.tourTitle || 'Luxury Expedition'}
- **Booking ID:** \`${b.id || 'AV-2026-9041'}\`
- **Departure Date:** ${b.travelDate || 'Upcoming Weekend'}
- **Travelers:** ${b.travelersCount || 2} Guests (${b.travelerName || 'Primary Guest'})
- **Total Amount:** ₹${Number(b.totalAmount || 18999).toLocaleString('en-IN')}
- **Current Status:** **${b.status?.toUpperCase() || 'CONFIRMED'}** (Voucher Issued)
- **Included:** 4-Star Resort Accommodation, Airport/Station Pickup, Guided Tours, Daily Breakfast.

You can view full vouchers and download the official tax invoice directly from your **Customer Dashboard**.`;
      } else {
        reply = `### 📋 Your AuraVoyage Bookings Overview

You currently have active access to the booking portal. You can view full itineraries, download GST invoices, and track live status under **"My Bookings"** on the top navigation bar!

Would you like me to recommend an upcoming destination tailored to your preferred travel season or budget?`;
      }
    } else if (lower.includes('itinerary') || lower.includes('plan')) {
      reply = `### 🗺️ Tailored 4-Day Curated Itinerary Blueprint

Here is our signature itinerary framework for an unforgettable retreat:

- **Day 01 — Royal Arrival & Twilight Check-in**
  Chauffeured arrival at your boutique resort, welcome spiced tea, evening sunset stroll at scenic viewpoint followed by a welcome dinner.
- **Day 02 — Nature & Heritage Immersion**
  Morning bird-watching and nature trek. Afternoon heritage site exploration with an expert local historian. Sunset tea plantation tasting.
- **Day 03 — Adventure & Cultural Twilight**
  Guided boat cruise or panoramic cable car ascent. Evening artisanal market walk and traditional cultural performance.
- **Day 04 — Serene Morning & Seamless Departure**
  Gourmet breakfast overlooking the valley, artisanal souvenir curation, and private chauffeured transfer to the transit hub.

*Would you like me to customize this for Ooty, Kodaikanal, Kerala, or Kashmir?*`;
    } else {
      reply = `Welcome to **AuraVoyage Travel Concierge**. I can assist you with:

- **Finding trips tailored to your budget** (e.g. *"Show me packages under ₹10,000"*)
- **Comparing destinations** (e.g. *"Compare Ooty and Kodaikanal"*)
- **Recommending family or honeymoon packages**
- **Generating customized day-by-day itineraries**
- **Checking tour availability, seasonal weather, and travel tips**

Where would you like to travel next?`;
    }

    return res.json({ reply });
  });

  // Vite middleware in development; Static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraVoyage Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
