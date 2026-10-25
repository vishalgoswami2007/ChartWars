// Level 3: a hammer candle near support after a downtrend. Candle format: [open, high, low, close].
const level = {
  id: 3,
  title: "A hammer at support",
  focus: "Candle wicks and context",
  objective: "Read the last candle in context: its wick, the support level and what it may suggest.",
  briefing: {
    concept:
      "A hammer has a small body near the top and a long lower wick. It shows that sellers pushed price down, but buyers pushed it back. Near a support level after a fall, it can be an early sign of a bullish reversal. It is a clue, not a guarantee, so many traders look for confirmation.",
    instructions: [
      "Study the last candle: body size and wick length.",
      "Check where it formed relative to the marked support line.",
      "Choose BUY, SELL or WAIT. Mention what you see and what it may suggest.",
    ],
  },
  timeframe: "Sample data · 1H",
  candles: [
    [110.0, 110.4, 108.8, 109.0],
    [109.0, 109.5, 107.6, 107.9],
    [107.9, 108.6, 107.2, 108.3],
    [108.3, 108.5, 106.0, 106.4],
    [106.4, 106.9, 105.0, 105.3],
    [105.3, 106.2, 104.8, 105.9],
    [105.9, 106.0, 103.4, 103.8],
    [103.8, 104.1, 102.0, 102.4],
    [102.4, 103.0, 101.2, 101.6],
    [101.6, 102.0, 99.4, 99.9],
    [99.9, 100.8, 98.6, 99.0],
    [99.0, 99.7, 97.4, 97.8],
    [97.8, 98.2, 96.0, 96.5],
    [96.5, 97.4, 95.4, 95.9],
    [95.9, 96.2, 93.8, 94.2],
    [94.2, 94.6, 92.4, 92.8],
    [92.8, 93.5, 91.6, 92.0],
    [92.0, 92.3, 90.4, 90.8],
    [90.8, 91.2, 90.0, 90.5],
    [90.6, 90.9, 88.9, 90.8],
  ],
  reveal: [
    [90.8, 92.0, 90.7, 91.8],
    [91.8, 93.1, 91.5, 92.9],
    [92.9, 93.8, 92.6, 93.4],
    [93.4, 93.9, 92.5, 92.8],
  ],
  // The support was identified on a higher timeframe, so earlier touches are not shown here.
  lines: [{ price: 90.0, label: "Support 90.00", kind: "support" }],
  question:
    "A candle with a long lower wick appeared near the marked support level after a downtrend. What would you do, and why?",
  decisions: {
    wait: {
      score: 100,
      acceptable: true,
      feedback: "Waiting for a confirmation candle is a patient and well-supported choice for a single reversal candle.",
    },
    buy: {
      score: 90,
      acceptable: true,
      feedback: "Buying is acceptable when you explain the rejection at support. Planning for confirmation or a stop-loss makes it stronger.",
    },
    sell: {
      score: 0,
      acceptable: false,
      feedback: "A hammer after a fall, at support, is read as a possible bullish reversal clue, not a sell signal.",
    },
  },
  concepts: [
    {
      id: "hammer",
      label: "Identifies the hammer or its long lower wick",
      weight: 25,
      required: true,
      terms: ["hammer", "long lower wick", "long lower shadow", "lower wick", "lower shadow", "long tail"],
    },
    {
      id: "support",
      label: "Uses the support level as context",
      weight: 25,
      required: true,
      terms: ["support", "support level", "support zone", "demand zone", "floor"],
    },
    {
      id: "rejection",
      label: "Explains the rejection of lower prices",
      weight: 25,
      terms: ["rejection", "rejected", "rejects", "buyers stepped in", "buyers defended", "buyers pushed", "bounced", "closed back above", "pushed back up"],
    },
    {
      id: "reversal",
      label: "Links it to a possible reversal",
      weight: 15,
      terms: ["reversal", "bullish reversal", "trend reversal", "turn up", "turning up", "change in direction", "possible bounce"],
    },
    {
      id: "confirmation",
      label: "Mentions confirmation or caution",
      weight: 10,
      terms: ["confirmation", "confirm", "confirmed", "next candle", "confirmation candle", "wait for", "close above"],
    },
  ],
  requiredAnyOf: [["rejection", "reversal"]],
  misconceptions: [
    {
      id: "hammer-bearish",
      patterns: ["hammer is bearish", "hammer means bearish", "bearish hammer", "hammer signals a drop", "hammer means sell"],
      message: "A hammer after a fall at support is read as a possible bullish reversal clue. The long lower wick shows sellers were rejected.",
    },
    {
      id: "guarantee",
      patterns: ["guaranteed", "will definitely", "for sure", "100 percent", "no risk"],
      message: "No candle pattern guarantees an outcome. Talk about probability and confirmation, not certainty.",
    },
  ],
  hints: [
    { text: "Look only at the last candle. Compare the size of its body with the length of its wicks." },
    {
      text: "The marked candle has a very long lower wick. What does that wick say about where price traded and where it was pushed back from?",
      highlight: { markers: [{ index: 19, pos: "below", text: "Long wick" }] },
    },
    {
      text: "Compare the low of this candle with the support line, and then where the candle closed. What does that suggest about the buyers?",
      highlight: { markers: [{ index: 19, pos: "above", text: "Closed above support" }] },
    },
  ],
  explanation:
    "The last candle is a hammer: a small body near the top with a long lower wick. It dipped below the 90.00 support and closed back above it, which shows rejection of lower prices after a downtrend. That makes a bullish reversal possible, but one candle is only a clue, so WAIT for confirmation, or BUY with a clear stop-loss, are both defensible. SELL ignores the rejection.",
  testAnswers: [
    {
      name: "Good BUY answer",
      decision: "buy",
      text: "A hammer formed at the support level after a downtrend. The long lower wick shows rejection of lower prices, so this may be a bullish reversal, but I would prefer confirmation.",
      expectPass: true,
    },
    {
      name: "Good WAIT answer",
      decision: "wait",
      text: "The hammer near support has a long lower wick, which means buyers rejected lower prices, so I will wait for a confirmation candle before buying.",
      expectPass: true,
    },
    { name: "Hammer read as bearish", decision: "sell", text: "The hammer is bearish so I would sell the position here immediately.", expectPass: false },
    { name: "Keyword list only", decision: "buy", text: "hammer support rejection reversal", expectPass: false },
    { name: "No concepts", decision: "buy", text: "It looks like the price will bounce now so I will buy it for sure.", expectPass: false },
  ],
};

export default level;