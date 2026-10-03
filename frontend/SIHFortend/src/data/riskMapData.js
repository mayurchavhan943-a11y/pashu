export const riskMapSummary = {
  totalCases: 128,
  lowRiskAreas: 52,
  mediumRiskAreas: 46,
  highRiskAreas: 30
};

export const mapMarkers = [
  {
    id: 1,
    village: "Khed",
    district: "Pune",
    state: "Maharashtra",
    animalType: "Cattle",
    disease: "FMD",
    cases: 18,
    riskLevel: "HIGH",
    lastReported: "2026-09-10",
    lat: 18.8475,
    lng: 73.8961
  },
  {
    id: 2,
    village: "Baramati",
    district: "Pune",
    state: "Maharashtra",
    animalType: "Buffalo",
    disease: "LSD",
    cases: 5,
    riskLevel: "MEDIUM",
    lastReported: "2026-09-08",
    lat: 18.1513,
    lng: 74.5804
  },
  {
    id: 3,
    village: "Shirur",
    district: "Pune",
    state: "Maharashtra",
    animalType: "Goat",
    disease: "PPR",
    cases: 2,
    riskLevel: "LOW",
    lastReported: "2026-09-05",
    lat: 18.8267,
    lng: 74.3752
  },
  {
    id: 4,
    village: "Sinnar",
    district: "Nashik",
    state: "Maharashtra",
    animalType: "Sheep",
    disease: "Bluetongue",
    cases: 12,
    riskLevel: "HIGH",
    lastReported: "2026-09-09",
    lat: 19.8458,
    lng: 73.9984
  },
  {
    id: 5,
    village: "Karvir",
    district: "Kolhapur",
    state: "Maharashtra",
    animalType: "Cattle",
    disease: "Mastitis",
    cases: 1,
    riskLevel: "LOW",
    lastReported: "2026-09-01",
    lat: 16.6913,
    lng: 74.2433
  }
];

export const hotspots = [
  {
    id: "h1",
    district: "Pune",
    activeCases: 23,
    trend: 18, // +18%
    status: "critical"
  },
  {
    id: "h2",
    district: "Nashik",
    activeCases: 14,
    trend: 7, // +7%
    status: "warning"
  },
  {
    id: "h3",
    district: "Kolhapur",
    activeCases: 5,
    trend: -12, // -12%
    status: "safe"
  }
];

export const getAreaDetails = (id) => {
  const marker = mapMarkers.find(m => m.id === id);
  if (!marker) return null;
  return {
    ...marker,
    totalAnimalsReported: 450,
    activeCases: marker.cases,
    recoveredCases: 32,
    criticalCases: 4,
    topDiseases: [marker.disease, "Respiratory Issues"],
    diseaseTrend: "Increasing",
    recentReports: 12,
    recommendedAction: "Risk is increasing in this area due to increasing reported cases. Quarantine affected animals immediately."
  };
};
