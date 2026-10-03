import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/common/Card";
import { Activity, Clock, HeartPulse, Stethoscope, ChevronLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { animalService } from "../../services/animalService";
import api from "../../services/api";

const healthHistoryData = [
  { date: 'Jan', score: 85 },
  { date: 'Feb', score: 88 },
  { date: 'Mar', score: 92 },
  { date: 'Apr', score: 78 },
  { date: 'May', score: 95 },
];

export default function AnimalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalAndRecords = async () => {
      setLoading(true);
      try {
        const animalData = await animalService.getAnimalById(id);
        setAnimal(animalData);
        try {
          const recRes = await api.get(`/health-records/animal/${id}`);
          setRecords(Array.isArray(recRes.data) ? recRes.data : []);
        } catch (recErr) {
          console.log("No health records found or failed:", recErr);
        }
      } catch (error) {
        console.error("Failed to fetch animal details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimalAndRecords();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading animal profile...</div>;
  }

  if (!animal) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-900">Animal not found</h2>
        <Button className="mt-4" onClick={() => navigate('/animals')}>Back to Animals</Button>
      </div>
    );
  }

  const name = animal.name || animal.nameOrTag || "Unnamed Animal";
  const species = animal.species || animal.animalType || "Unknown";
  const status = animal.healthStatus || "Healthy";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/animals')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{name}</h1>
          <p className="text-sm text-slate-500">ID: #{animal.id} • {species}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="aspect-square bg-primary-50 rounded-lg mb-6 flex flex-col items-center justify-center text-primary-600 border border-primary-100">
              <span className="text-5xl font-bold">{species[0]}</span>
              <span className="text-xs text-slate-500 mt-2">{species}</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-sm text-slate-500">Status</span>
                <Badge variant={status === 'Healthy' ? 'success' : 'warning'}>{status}</Badge>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-slate-500">Breed</span>
                <span className="font-medium text-slate-900">{animal.breed || "Standard"}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-slate-500">Age</span>
                <span className="font-medium text-slate-900">{animal.age != null ? `${animal.age} yrs` : "-"}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-slate-500">Weight</span>
                <span className="font-medium text-slate-900">{animal.weight ? `${animal.weight} kg` : "-"}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm text-slate-500">Gender</span>
                <span className="font-medium text-slate-900">{animal.gender || "Male"}</span>
              </div>
              {animal.location && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Notes</span>
                  <span className="font-medium text-slate-900 text-xs max-w-[150px] truncate">{animal.location}</span>
                </div>
              )}
            </div>

            <Button className="w-full mt-6" onClick={() => navigate(`/health-check?animal=${animal.id}`)}>
              <HeartPulse className="mr-2 h-4 w-4" /> Run AI Health Check
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Clock className="h-6 w-6 text-primary-500 mb-2" />
                <p className="text-xs text-slate-500">Records</p>
                <p className="font-bold text-slate-900 mt-1">{records.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Activity className="h-6 w-6 text-warning-500 mb-2" />
                <p className="text-xs text-slate-500">Current Risk</p>
                <p className="font-bold text-slate-900 mt-1">{status === 'Healthy' ? 'Low' : 'Moderate'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <HeartPulse className="h-6 w-6 text-critical-500 mb-2" />
                <p className="text-xs text-slate-500">Active Issues</p>
                <p className="font-bold text-slate-900 mt-1">{status === 'Healthy' ? '0' : '1'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Stethoscope className="h-6 w-6 text-primary-600 mb-2" />
                <p className="text-xs text-slate-500">Vet Advice</p>
                <p className="font-bold text-slate-900 mt-1">Available</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Health Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthHistoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 100]} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: '#22c55e', strokeWidth: 0}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Health Records History</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>View All</Button>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-500">
                  No health assessments saved yet. Run a health check to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map(rec => (
                    <div key={rec.id} className="flex gap-4 border-l-2 border-primary-500 pl-4 py-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {rec.symptoms || "Health Assessment"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {rec.additionalInformation || `Temp: ${rec.temperature ? rec.temperature + '°C' : 'N/A'}`}
                        </p>
                      </div>
                      <div className="ml-auto text-xs text-slate-400">
                        {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "Recent"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}