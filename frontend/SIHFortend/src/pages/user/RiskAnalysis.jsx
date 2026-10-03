import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, ComposedChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/common/Card";
import { StatCard } from "../../components/common/StatCard";
import { Select } from "../../components/common/Select";
import { Badge } from "../../components/common/Badge";
import { Thermometer, Droplets, CloudRain, Cloud, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { weatherService } from "../../services/weatherService";
import { riskAnalysisService } from "../../services/riskAnalysisService";

export default function RiskAnalysis() {
  const [weather, setWeather] = useState(null);
  const [historySummary, setHistorySummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [weatherHistory, setWeatherHistory] = useState([]);
  const [riskData, setRiskData] = useState(null);
  const [timeFilter, setTimeFilter] = useState("7days");

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    const [w, hSum, t, wHist, rFact] = await Promise.all([
      weatherService.getCurrentWeather(),
      riskAnalysisService.getDiseaseHistorySummary(),
      riskAnalysisService.getDiseaseTrends(timeFilter),
      weatherService.getWeatherHistory(),
      riskAnalysisService.getRiskFactors()
    ]);
    
    setWeather(w);
    setHistorySummary(hSum);
    setTrends(t);
    setWeatherHistory(wHist);
    
    const calculatedRisk = await riskAnalysisService.calculateRiskScore(rFact);
    setRiskData(calculatedRisk);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Environmental & Disease Risk Analysis</h1>
        <p className="text-slate-500">Assess disease risk using weather conditions, historical cases and recent health reports.</p>
      </div>

      {weather && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Current Weather Conditions - {weather.location}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Temperature" value={`${weather.temperature}°C`} icon={Thermometer} color="primary" />
            <StatCard title="Humidity" value={`${weather.humidity}%`} icon={Droplets} color="primary" />
            <StatCard title="Rainfall" value={`${weather.rainfall} mm`} icon={CloudRain} color="primary" />
            <StatCard title="Condition" value={weather.condition} icon={Cloud} color="primary" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Disease Cases Over Time</CardTitle>
              <Select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="w-36">
                <option value="7days">7 Days</option>
                <option value="30days">30 Days</option>
                <option value="3months">3 Months</option>
                <option value="6months">6 Months</option>
                <option value="1year">1 Year</option>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cases" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weather vs Disease Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={weatherHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="humidity" fill="#3b82f6" name="Humidity (%)" opacity={0.6} />
                    <Line yAxisId="right" type="monotone" dataKey="cases" stroke="#ef4444" name="Disease Cases" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {historySummary && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Historical Disease Data</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Historical Cases" value={historySummary.historicalCases} />
                <StatCard title="Previous Outbreaks" value={historySummary.previousOutbreaks} />
                <StatCard title="Active Cases" value={historySummary.activeCases} color="critical" />
                <StatCard title="Recovered Cases" value={historySummary.recoveredCases} color="success" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-red-100 bg-red-50/30">
            <CardHeader>
              <CardTitle>Environmental Disease Risk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {riskData && (
                <>
                  <div className="flex flex-col items-center justify-center py-4">
                    <Badge variant={riskData.level === 'HIGH' ? 'critical' : riskData.level === 'MEDIUM' ? 'warning' : 'success'} className="text-xl px-4 py-1 mb-2">
                      {riskData.level} RISK
                    </Badge>
                    <div className="text-4xl font-bold text-slate-900">{riskData.score} <span className="text-lg font-normal text-slate-500">/ 100</span></div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-4">
                      <div className={`h-2.5 rounded-full ${riskData.level === 'HIGH' ? 'bg-red-600' : riskData.level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${riskData.score}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                    <h4 className="font-semibold text-slate-700">Risk Factors</h4>
                    <ul className="space-y-2">
                      {riskData.factors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <span><span className="font-medium text-slate-900">{factor.level}</span> {factor.value && `(${factor.value})`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-2 items-start text-sm text-blue-800">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>Conditions associated with increased disease risk. This is an environmental assessment indicator and does not directly confirm a disease.</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
