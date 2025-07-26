import yahooFinance from "yahoo-finance2";
import { VercelRequest, VercelResponse } from "@vercel/node";

// Helper function to process date parameter (string) to appropriate format
function processDateParameter(dateParam: string): string | number {
  // Check if the string is a timestamp (all digits, possibly with decimal)
  if (/^\d+(\.\d+)?$/.test(dateParam)) {
    // It's a timestamp string, convert to number and divide by 1000 for Yahoo Finance API
    return Number(dateParam) / 1000;
  }
  // It's a yyyy-mm-dd format string, return as is
  return dateParam;
}

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
    return res.status(400).json({ error: "Only one end date is allowed" });
  }

  if (start == end) {
    return res
      .status(400)
      .json({ error: "Start and end dates cannot be the same" });
  }

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-CA").format(date);

  try {
    const period1 = start ? processDateParameter(start) : today;
    const queryOptions = end
      ? { period1, period2: processDateParameter(end) }
      : { period1 };

    const result = await yahooFinance.chart(symbol, queryOptions);
    res.status(200).json({
      quotes: result.quotes,
    });
  } catch (error) {
    console.error("Yahoo Finance Error:", error);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
}
