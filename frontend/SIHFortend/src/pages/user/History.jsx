import { Card, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { animalService } from "../../services/animalService";
import api from "../../services/api";

const formatRecordDate = (dateVal) => {
  if (!dateVal) return new Date().toLocaleDateString();
  try {
    if (Array.isArray(dateVal)) {
      return new Date(dateVal[0], dateVal[1] - 1, dateVal[2], dateVal[3] || 0, dateVal[4] || 0).toLocaleDateString();
    }
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString();
    }
  } catch (e) {
    console.error("Date parse error", e);
  }
  return new Date().toLocaleDateString();
};

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const animals = await animalService.getAllAnimals();
        let allRecords = [];
        
        for (const animal of animals) {
          try {
            const res = await api.get('/health-records/animal/' + animal.id);
            const aName = animal.name || animal.nameOrTag || "Unknown";
            const aSpecies = animal.species || animal.animalType || "Animal";

            const records = (Array.isArray(res.data) ? res.data : []).map(r => {
              let condition = r.symptoms || "Health Assessment";
              let risk = "LOW";
              if (r.additionalInformation && r.additionalInformation.includes(" | Risk: ")) {
                 const parts = r.additionalInformation.split(" | Risk: ");
                 condition = parts[0];
                 risk = parts[1];
              }
              
              return {
                id: r.id,
                date: formatRecordDate(r.createdAt),
                animalId: animal.id,
                animal: `${aName} (${aSpecies})`,
                condition: condition,
                risk: risk,
                temperature: r.temperature ? `${r.temperature}°C` : null,
                duration: r.duration
              };
            });
            allRecords = [...allRecords, ...records];
          } catch (e) {
            console.error("Failed to fetch records for animal", animal.id, e);
          }
        }
        
        allRecords.sort((a, b) => b.id - a.id);
        setHistory(allRecords);
      } catch (error) {
        console.error("Failed to fetch animals for history", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  if (loading) {
     return <div className="p-12 text-center text-slate-500">Loading health history...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Health History</h1>
          <p className="mt-1 text-sm text-slate-500">Review past AI assessments, recorded conditions, and vital logs.</p>
        </div>
        <Button onClick={() => navigate('/health-check')}>
          New Health Check
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Animal</th>
                  <th className="px-6 py-4 font-semibold">Condition Assessment</th>
                  <th className="px-6 py-4 font-semibold">Risk Level</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? history.map((record) => (
                  <tr key={record.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">{record.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{record.animal}</td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>{record.condition}</div>
                      {record.temperature && (
                        <div className="text-xs text-slate-400 mt-0.5">Temp: {record.temperature}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        record.risk === 'CRITICAL' ? 'critical' : 
                        record.risk === 'HIGH' ? 'critical' : 
                        record.risk === 'MODERATE' ? 'warning' : 'success'
                      }>{record.risk}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/animals/${record.animalId}`)}>
                        View Animal
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      <p className="font-medium text-slate-700">No health history records found.</p>
                      <p className="text-xs text-slate-400 mt-1">Run an AI Health Check on any registered animal and click "Save Health Report" to log records here.</p>
                      <Button className="mt-4" size="sm" onClick={() => navigate('/health-check')}>
                        Start Health Check
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
