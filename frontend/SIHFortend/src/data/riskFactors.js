export const currentRiskFactors = {
  humidity: { value: "82%", level: "High", score: 20 },
  rainfall: { value: "14 mm", level: "Moderate", score: 12 },
  historicalOutbreak: { value: "Yes", level: "High", score: 25 },
  recentCases: { value: "+23%", level: "Increasing", score: 25 },
  otherFactors: { value: "Dense population", level: "Medium", score: 10 }
};

// Score mapping logic
// 0-30: LOW
// 31-60: MEDIUM
// 61-100: HIGH
