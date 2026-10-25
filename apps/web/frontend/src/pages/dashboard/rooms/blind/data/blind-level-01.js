// Level 1: reading an uptrend. Candle format: [open, high, low, close].
const level = {
  id: 1,
  title: "Reading the trend",
  focus: "Trend direction",
  objective: "Decide which side is in control by comparing swing highs and swing lows.",
  briefing: {
    concept:
      "In an uptrend, each peak (swing high) and each dip (swing low) is higher than the one before. In a downtrend, both are lower. The direction tells you which side is currently in control.",
    instructions: [
      "Look at the peaks, then at the dips between them.",
      "Compare each peak and dip with the previous one.",
      "Choose BUY, SELL or WAIT, then explain why in your own words.",
    ],
  },
  timeframe: "Sample data · 1H",
  candles: [
    [100.0, 101.2, 99.6, 100.8],
    [100.8, 102.0, 100.4, 101.6],
    [101.6, 102.1, 100.9, 101.2],
    [101.2, 102.8, 101.0, 102.5],
    [102.5, 103.6, 102.2, 103.3],
    [103.3, 103.7, 102.5, 102.8],
    [102.8, 103.2, 102.0, 102.3],
    [102.3, 104.0, 102.2, 103.8],
    [103.8, 105.0, 103.6, 104.7],
    [104.7, 105.4, 104.1, 104.4],
    [104.4, 106.0, 104.3, 105.8],
    [105.8, 106.9, 105.5, 106.6],
    [106.6, 107.1, 105.8, 106.0],
    [106.0, 106.4, 105.2, 105.6],
    [105.6, 107.4, 105.5, 107.2],
    [107.2, 108.3, 107.0, 108.0],
    [108.0, 108.9, 107.6, 108.6],
    [108.6, 109.0, 107.8, 108.1],
    [108.1, 109.6, 108.0, 109.4],
    [109.4, 110.5, 109.2, 110.2],
  ],
  // What happened next. Shown only after the answer. Fixed in advance, never changed by the answer.
  reveal: [
    [110.2, 110.4, 109.0, 109.3],
    [109.3, 111.2, 109.2, 111.0],
    [111.0, 112.1, 110.8, 111.8],
    [111.8, 112.6, 111.3, 112.3],
  ],
  lines: [],
  question:
    "Price has moved from the lower left to the upper right of the chart. Looking at the swing highs and swing lows, what is the most sensible decision, and why?",
  decisions: {
    buy: {
      score: 100,
      acceptable: true,
      feedback: "Buying with the trend is a sensible choice, as long as your reason is the trend structure.",
    },
    wait: {
      score: 75,
      acceptable: true,
      feedback: "Waiting for a small pullback can be reasonable in a strong trend, as long as you do not ignore the trend itself.",
    },
    sell: {
      score: 0,
      acceptable: false,
      feedback: "Selling against a clear uptrend needs a strong reversal reason, and this chart does not show one.",
    },
  },
  concepts: [
    {
      id: "trend",
      label: "Names the trend direction",
      weight: 30,
      required: true,
      terms: ["uptrend", "up trend", "upward trend", "bullish trend", "trending up", "trending higher", "moving up", "rising trend", "upward"],
    },
    {
      id: "highs",
      label: "Higher highs (rising peaks)",
      weight: 25,
      terms: ["higher high", "higher highs", "new highs", "rising highs", "each peak is higher", "peaks are higher", "rising peaks"],
    },
    {
      id: "lows",
      label: "Higher lows (rising dips)",
      weight: 25,
      terms: ["higher low", "higher lows", "rising lows", "dips are higher", "pullbacks hold", "shallow pullback", "shallow pullbacks", "rising dips"],
    },
    {
      id: "follow",
      label: "Trading with the trend",
      weight: 20,
      terms: ["with the trend", "follow the trend", "trend following", "trend continuation", "continuation", "momentum", "buyers are in control", "buyers control"],
    },
  ],
  requiredAnyOf: [["highs", "lows"]],
  misconceptions: [
    {
      id: "too-high",
      patterns: ["overbought", "too high", "has to fall", "must fall", "must drop", "due for a drop", "price is high"],
      message: "A high price is not a reason to sell on its own. In a trend, price can stay high for a long time.",
    },
  ],
  hints: [
    { text: "Look at the peaks first, then at the dips. Ignore the colour of single candles for now." },
    {
      text: "Compare the marked peaks with each other. Is each one higher or lower than the one before?",
      highlight: {
        markers: [1, 4, 8, 11, 15, 19].map((index, i) => ({ index, pos: "above", text: `P${i + 1}` })),
      },
    },
    {
      text: "Now compare the marked dips between those peaks. If peaks and dips both rise, which side is in control?",
      highlight: {
        markers: [2, 6, 9, 13, 17].map((index, i) => ({ index, pos: "below", text: `D${i + 1}` })),
      },
    },
  ],
  explanation:
    "Every swing high (P1 to P6) is higher than the one before, and every swing low (D1 to D5) is higher than the one before. That is an uptrend. Buying with the trend, or waiting for a small pullback inside it, are both sensible. Selling needs evidence of a reversal, such as a break of the rising lows.",
  // Authored checks. They run in development and print failures to the console.
  testAnswers: [
    {
      name: "Good BUY answer",
      decision: "buy",
      text: "The chart is in an uptrend because it keeps making higher highs and higher lows, so I would buy with the trend.",
      expectPass: true,
    },
    {
      name: "Good WAIT answer",
      decision: "wait",
      text: "This is an uptrend with higher highs, but price just made a peak, so I would wait for a shallow pullback to join the trend.",
      expectPass: true,
    },
    { name: "Keyword list only", decision: "buy", text: "uptrend higher highs higher lows", expectPass: false },
    { name: "Wrong decision", decision: "sell", text: "I would sell because the price is too high and must fall soon.", expectPass: false },
    { name: "No concepts", decision: "buy", text: "I think it will go up so I will buy it now.", expectPass: false },
    { name: "Negated concept", decision: "buy", text: "This is not an uptrend and there are no higher highs here, but I would still buy because it looks good.", expectPass: false },
  ],
};

export default level;