import { useAuth } from "../../context/AuthContext";
import { StatCard } from "../../components/common/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { List, CheckCircle, Activity, AlertTriangle, AlertCircle, ChevronRight, Stethoscope, ArrowUpRight, ArrowDownRight, Map } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { animalService } from "../../services/animalService";
import { veterinarianService } from "../../services/veterinarianService";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

const healthTrendData = [
  { name: 'Jan', healthy: 12, sick: 2 },
  { name: 'Feb', healthy: 15, sick: 1 },
  { name: 'Mar', healthy: 18, sick: 4 },
  { name: 'Apr', healthy: 22, sick: 2 },
  { name: 'May', healthy: 25, sick: 3 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [animals, setAnimals] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [animalsData, vetsData] = await Promise.all([
          animalService.getAllAnimals(),
          veterinarianService.getAllVeterinarians()
        ]);
        setAnimals(Array.isArray(animalsData) ? animalsData : []);
        setVets(Array.isArray(vetsData) ? vetsData : []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const healthyCount = animals.filter(a => a.healthStatus === 'Healthy').length;
  const criticalCount = animals.filter(a => a.healthStatus === 'Critical').length;
  const observationCount = animals.length - healthyCount - criticalCount;

  const stats = [
    { title: "Total Animals", value: animals.length.toString(), icon: List, color: "primary" },
    { title: "Healthy", value: healthyCount.toString(), icon: CheckCircle, color: "success" },
    { title: "Observation", value: observationCount.toString(), icon: Activity, color: "warning" },
    { title: "Critical", value: criticalCount.toString(), icon: AlertTriangle, color: "critical" },
  ];

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Good morning, {user?.name || user?.email || "Farmer"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is your animal health overview.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="healthy" name="Healthy" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sick" name="Sick" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Animals</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/animals')}>
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
              <CardContent>
              <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
                <div className="flex gap-4 pb-4">
                  {animals.slice(0, 10).map(animal => (
                    <Link to={`/animals/${animal.id}`} key={animal.id} className="min-w-[200px] shrink-0">
                      <div className="rounded-lg border border-slate-200 p-4 hover:border-primary-500 hover:shadow-sm transition-all bg-slate-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-slate-900">{animal.name}</h4>
                          <Badge variant={animal.healthStatus === 'Healthy' ? 'success' : animal.healthStatus === 'Critical' ? 'critical' : 'warning'}>
                            {animal.healthStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500">{animal.species} • {animal.breed}</p>
                        <p className="text-xs text-slate-400 mt-2">Last check: {animal.lastCheck || 'N/A'}</p>
                      </div>
                    </Link>
                  ))}
                  {animals.length === 0 && (
                    <p className="text-sm text-slate-500">No animals found.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-red-100 bg-red-50/30">
            <CardHeader className="pb-2">
              <CardTitle>Regional Animal Health Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="critical" className="text-sm px-2 py-0.5">HIGH RISK</Badge>
                  <p className="text-sm text-slate-600 mt-1">Pune District</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-red-600">82</span>
                  <span className="text-sm text-slate-500">/100</span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-red-400" /> High humidity & recent rainfall</p>
                <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-red-400" /> Increasing reported cases</p>
              </div>
              <div className="flex gap-2">
                <Button variant="primary" className="flex-1 text-xs" onClick={() => navigate('/risk-map')}>
                  <Map className="w-4 h-4 mr-1" /> Map
                </Button>
                <Button variant="secondary" className="flex-1 text-xs" onClick={() => navigate('/risk-analysis')}>
                  <Activity className="w-4 h-4 mr-1" /> Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Emerging Disease Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">FMD</span>
                  <span className="text-sm font-bold text-red-600 flex items-center"><ArrowUpRight className="w-4 h-4 mr-1" /> 18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Respiratory Issues</span>
                  <span className="text-sm font-bold text-red-600 flex items-center"><ArrowUpRight className="w-4 h-4 mr-1" /> 12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Skin Conditions</span>
                  <span className="text-sm font-bold text-green-600 flex items-center"><ArrowDownRight className="w-4 h-4 mr-1" /> 5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Digestive Issues</span>
                  <span className="text-sm font-bold text-red-600 flex items-center"><ArrowUpRight className="w-4 h-4 mr-1" /> 7%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 items-start p-3 rounded-lg bg-critical-50 border border-critical-100">
                <AlertCircle className="h-5 w-5 text-critical-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-critical-900">Critical health alert</p>
                  <p className="text-xs text-critical-700 mt-1">Raja (Horse) reported severe colic symptoms.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start p-3 rounded-lg bg-warning-50 border border-warning-100">
                <AlertTriangle className="h-5 w-5 text-warning-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-900">Vaccination reminder</p>
                  <p className="text-xs text-warning-700 mt-1">Gauri (Cow) needs FMD booster this week.</p>
                </div>
              </div>
            </CardContent>
          </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Nearby Vets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vets.slice(0, 3).map(vet => (
                  <div key={vet.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                    <div className="bg-primary-100 p-2 rounded-full text-primary-600 flex items-center justify-center shrink-0">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">Dr. {vet.firstName} {vet.lastName}</p>
                      <p className="text-xs text-slate-500 truncate">{vet.specialization || 'Livestock Specialist'} • {(Math.random() * 5 + 1).toFixed(1)} km away</p>
                    </div>
                  </div>
                ))}
                {vets.length === 0 && (
                  <p className="text-sm text-slate-500">No veterinarians found.</p>
                )}
                <Button variant="secondary" className="w-full text-sm">
                  Find More
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}