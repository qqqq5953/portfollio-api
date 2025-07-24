import yahooFinance from "yahoo-finance2";

export default async function handler(req, res) {
  // Allow requests from anywhere (or restrict to your frontend URL)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol query parameter" });
  }

  try {
    const queryOptions = { period1: "2025-07-23" };
    const result = await yahooFinance.chart(symbol, queryOptions);
    res.status(200).json(result);
  } catch (error) {
    console.error("Yahoo Finance Error:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
}
