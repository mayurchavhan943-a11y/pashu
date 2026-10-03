import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/common/Card";
import { StatCard } from "../../components/common/StatCard";
import { Button } from "../../components/common/Button";
import { Select } from "../../components/common/Select";
import { Badge } from "../../components/common/Badge";
import { AlertTriangle, Map, Activity, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { riskMapService } from "../../services/riskMapService";

export default function RiskMap() {
  const [summary, setSummary] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    animalType: "",
    riskLevel: ""
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    const sum = await riskMapService.getSummary();
    const marks = await riskMapService.getMapMarkers(filters);
    const spots = await riskMapService.getHotspots();
    setSummary(sum);
    setMarkers(marks);
    setHotspots(spots);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaClick = async (id) => {
    const details = await riskMapService.getAreaDetailsById(id);
    setSelectedArea(details);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "HIGH": return "#ef4444"; // red-500
      case "MEDIUM": return "#eab308"; // yellow-500
      case "LOW": return "#22c55e"; // green-500
      default: return "#3b82f6"; // blue-500
    }
  };

  const center = [19.0, 75.0]; // Rough center for Maharashtra/India

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Geospatial Disease Risk Map</h1>
        <p className="text-slate-500">Monitor animal health risks and identify emerging disease hotspots.</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Cases" value={summary.totalCases} icon={Activity} color="primary" />
          <StatCard title="Low Risk Areas" value={summary.lowRiskAreas} icon={ShieldCheck} color="success" />
          <StatCard title="Medium Risk Areas" value={summary.mediumRiskAreas} icon={AlertTriangle} color="warning" />
          <StatCard title="High Risk Areas" value={summary.highRiskAreas} icon={ShieldAlert} color="critical" />
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Select name="state" value={filters.state} onChange={handleFilterChange} className="w-48">
              <option value="">All States</option>
              <option value="Maharashtra">Maharashtra</option>
            </Select>
            <Select name="district" value={filters.district} onChange={handleFilterChange} className="w-48">
              <option value="">All Districts</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Kolhapur">Kolhapur</option>
            </Select>
            <Select name="animalType" value={filters.animalType} onChange={handleFilterChange} className="w-48">
              <option value="">All Animals</option>
              <option value="Cattle">Cattle</option>
              <option value="Buffalo">Buffalo</option>
              <option value="Goat">Goat</option>
              <option value="Sheep">Sheep</option>
            </Select>
            <Select name="riskLevel" value={filters.riskLevel} onChange={handleFilterChange} className="w-48">
              <option value="">All Risk Levels</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="h-[500px] w-full">
              <MapContainer center={center} zoom={6} scrollWheelZoom={false} className="h-full w-full relative z-0">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers.map((marker) => (
                  <CircleMarker
                    key={marker.id}
                    center={[marker.lat, marker.lng]}
                    radius={Math.max(10, marker.cases * 1.5)}
                    pathOptions={{ color: getRiskColor(marker.riskLevel), fillColor: getRiskColor(marker.riskLevel), fillOpacity: 0.5 }}
                  >
                    <Popup>
                      <div className="p-2 space-y-2 min-w-[200px]">
                        <h3 className="font-bold">{marker.village}, {marker.district}</h3>
                        <p className="text-sm">State: {marker.state}</p>
                        <p className="text-sm">Animal: {marker.animalType}</p>
                        <p className="text-sm">Possible Condition: {marker.disease}</p>
                        <p className="text-sm font-medium">Cases: {marker.cases}</p>
                        <p className="text-sm">Last Updated: {marker.lastReported}</p>
                        <div className="mt-2">
                          <Badge variant={marker.riskLevel === 'HIGH' ? 'critical' : marker.riskLevel === 'MEDIUM' ? 'warning' : 'success'}>
                            {marker.riskLevel} RISK
                          </Badge>
                        </div>
                        <Button className="w-full mt-2" size="sm" onClick={() => handleAreaClick(marker.id)}>
                          View Area Details
                        </Button>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex gap-4 text-sm font-medium">
              <span>Legend:</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Low Risk</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Medium Risk</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> High Risk</span>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emerging Hotspots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hotspots.map((spot) => (
                <div key={spot.id} className="p-4 border border-slate-200 rounded-lg flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${spot.status === 'critical' ? 'bg-red-500' : spot.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                      {spot.district} District
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600">{spot.activeCases} active cases</p>
                  <p className={`text-sm font-medium ${spot.trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {spot.trend > 0 ? '+' : ''}{spot.trend}% from previous period
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedArea && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-white shadow-xl flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold">Area Details</h2>
              <button onClick={() => setSelectedArea(null)} className="text-slate-500 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedArea.village}</h3>
                <p className="text-slate-500">{selectedArea.district}, {selectedArea.state}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-500">Total Animals</p>
                  <p className="text-xl font-bold">{selectedArea.totalAnimalsReported}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-500">Active Cases</p>
                  <p className="text-xl font-bold text-red-600">{selectedArea.activeCases}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-500">Recovered</p>
                  <p className="text-xl font-bold text-green-600">{selectedArea.recoveredCases}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-500">Critical</p>
                  <p className="text-xl font-bold text-orange-600">{selectedArea.criticalCases}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Top Diseases</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArea.topDiseases.map((d, i) => (
                    <Badge key={i} variant="secondary">{d}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Risk Level</h4>
                <Badge variant={selectedArea.riskLevel === 'HIGH' ? 'critical' : selectedArea.riskLevel === 'MEDIUM' ? 'warning' : 'success'}>
                  {selectedArea.riskLevel} RISK
                </Badge>
                <p className="text-sm text-slate-600 mt-2">Disease trend: {selectedArea.diseaseTrend}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" /> Recommended Action
                </h4>
                <p className="text-sm text-orange-700">{selectedArea.recommendedAction}</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200">
              <Button className="w-full">View Detailed Analytics</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
