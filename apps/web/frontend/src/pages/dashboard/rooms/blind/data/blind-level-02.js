// Level 2: reading a downtrend. Candle format: [open, high, low, close].
const level = {
  id: 2,
  title: "The mirror: a downtrend",
  focus: "Trend direction",
  objective: "Apply the same swing logic to a falling market and notice that WAIT or SELL can be valid.",
  briefing: {
    concept:
      "A downtrend is a series of lower highs and lower lows. Sellers are in control, and bounces tend to fail below the previous peak. A low price alone is not a reason to buy.",
    instructions: [
      "Mark each bounce (swing high) and each drop (swing low) in your head.",
      "Check whether each one is lower than the last.",
      "Choose BUY, SELL or WAIT and explain your reasoning.",
    ],
  },
  timeframe: "Sample data · 1H",
  candles: [
    [105.0, 105.3, 103.9, 104.2],
    [104.2, 104.5, 102.8, 103.0],
    [103.0, 103.9, 102.7, 103.6],
    [103.6, 103.8, 101.9, 102.2],
    [102.2, 102.4, 100.6, 100.9],
    [100.9, 101.8, 100.7, 101.5],
    [101.5, 101.7, 99.8, 100.1],
    [100.1, 100.3, 98.5, 98.8],
    [98.8, 99.6, 98.4, 99.3],
    [99.3, 99.4, 97.5, 97.8],
    [97.8, 98.0, 96.2, 96.5],
    [96.5, 97.4, 96.3, 97.1],
    [97.1, 97.2, 95.2, 95.5],
    [95.5, 95.7, 93.9, 94.3],
    [94.3, 95.0, 94.1, 94.8],
    [94.8, 94.9, 93.0, 93.3],
    [93.3, 93.4, 91.7, 92.0],
    [92.0, 92.8, 91.8, 92.6],
    [92.6, 92.7, 90.9, 91.2],
  ],
  reveal: [
    [91.2, 91.4, 89.9, 90.2],
    [90.2, 91.0, 90.0, 90.8],
    [90.8, 90.9, 89.0, 89.3],
    [89.3, 89.5, 87.8, 88.1],
  ],
  lines: [],
  question:
    "Price has been falling for most of this chart, with a few small bounces. What is the most sensible decision now, and why?",
  decisions: {
    sell: {
      score: 100,
      acceptable: true,
      feedback: "Selling with the trend is consistent with the structure, as long as your reason is the lower highs and lower lows.",
    },
    wait: {
      score: 75,
      acceptable: true,
      feedback: "Waiting for a bounce to fail, or for clearer evidence, is a reasonable and patient choice in a downtrend.",
    },
    buy: {
      score: 0,
      acceptable: false,
      feedback: "Buying only because price is low is counter-trend and has no reversal evidence on this chart.",
    },
  },
  concepts: [
    {
      id: "trend",
      label: "Names the trend direction",
      weight: 30,
      required: true,
      terms: ["downtrend", "down trend", "downward trend", "bearish trend", "trending down", "trending lower", "moving down", "falling trend", "downward"],
    },
    {
      id: "highs",
      label: "Lower highs (bounces fail lower)",
      weight: 25,
      terms: ["lower high", "lower highs", "falling highs", "each peak is lower", "peaks are lower", "bounces fail", "bounces are weak", "weak bounces"],
    },
    {
      id: "lows",
      label: "Lower lows (new lows)",
      weight: 25,
      terms: ["lower low", "lower lows", "new lows", "falling lows", "making new lows"],
    },
    {
      id: "follow",
      label: "Trading with the trend",
      weight: 20,
      terms: ["with the trend", "follow the trend", "trend following", "trend continuation", "continuation", "momentum", "sellers are in control", "sellers control"],
    },
  ],
  requiredAnyOf: [["highs", "lows"]],
  misconceptions: [
    {
      id: "too-low",
      patterns: ["oversold", "too low", "has to bounce", "must bounce", "must rise", "due for a bounce", "price is cheap", "looks cheap"],
      message: "A low price is not a reason to buy by itself. Trends can keep falling longer than expected.",
    },
  ],
  hints: [
    { text: "Look at the bounces first. Does each bounce reach as high as the previous one?" },
    {
      text: "Compare the marked bounces with each other. Are they rising or falling?",
      highlight: {
        markers: [0, 2, 5, 8, 11, 14, 17].map((index, i) => ({ index, pos: "above", text: `P${i + 1}` })),
      },
    },
    {
      text: "Now compare the marked lows. Is price making new lows or defending old ones?",
      highlight: {
        markers: [1, 4, 7, 10, 13, 16, 18].map((index, i) => ({ index, pos: "below", text: `D${i + 1}` })),
      },
    },
  ],
  explanation:
    "Each bounce (P1 to P7) peaks lower than the one before, and each drop (D1 to D7) reaches a new low. That is a downtrend. SELL follows the structure; WAIT for a failed bounce is also reasonable. BUY only because price looks low ignores the trend and has no reversal signal.",
  testAnswers: [
    {
      name: "Good SELL answer",
      decision: "sell",
      text: "This is a downtrend because price keeps making lower highs and lower lows, so I would sell with the trend.",
      expectPass: true,
    },
    {
      name: "Good WAIT answer",
      decision: "wait",
      text: "The chart shows a downtrend with lower lows, so I would wait for a weak bounce to fail before acting.",
      expectPass: true,
    },
    { name: "Buy because it is cheap", decision: "buy", text: "Price is oversold and too low so it has to bounce, therefore I would buy now.", expectPass: false },
    { name: "Keyword list only", decision: "sell", text: "downtrend lower highs lower lows", expectPass: false },
    { name: "Vague", decision: "sell", text: "It keeps going down so I will sell it right now before it drops more.", expectPass: false },
  ],
};

export default level;