import yahooFinance from "yahoo-finance2";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow requests from anywhere (or restrict to your frontend URL)
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  console.log("req.query", req.query);

  const { symbol, start, end } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol query parameter" });
  }

  if (Array.isArray(symbol)) {
    return res.status(400).json({ error: "Only one symbol is allowed" });
  }

  if (Array.isArray(start)) {
    return res.status(400).json({ error: "Only one start date is allowed" });
  }

  if (Array.isArray(end)) {
    return res.status(400).json({ error: "Only one symbol is allowed" });
  }

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-CA").format(date);

  try {
    const queryOptions = end
      ? { period1: start ?? today, period2: end } // period2 already defaults to today
      : { period1: start ?? today };
    const result = await yahooFinance.chart(symbol, queryOptions);
    res.status(200).json(result);
  } catch (error) {
    console.error("Yahoo Finance Error:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
}
