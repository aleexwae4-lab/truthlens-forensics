import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import OpenAI from "openai";
import cors from "cors";

// Initialize Stripe and OpenAI lazily to avoid crash if keys are missing
let stripe: Stripe | null = null;
let openai: OpenAI | null = null;

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// --- API ROUTES ---

// Stripe Checkout Session
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe key not configured" });
    }
    if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // Configure in .env
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.origin}/?success=true`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// OpenAI Complementary Analysis (Optional)
app.post("/api/openai-analysis", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OpenAI key not configured" });
    }
    if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- VITE MIDDLEWARE / STATIC SERVING ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TRUTHLENS CORE RUNNING ON PORT ${PORT}`);
  });
}

startServer();
