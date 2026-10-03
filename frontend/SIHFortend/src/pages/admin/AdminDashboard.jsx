import { StatCard } from "../../components/common/StatCard";
import { Users, List, Activity, HeartPulse, AlertTriangle, Stethoscope, Map, CloudRain, TrendingUp } from "lucide-react";
import { Select } from "../../components/common/Select";
import { Badge } from "../../components/common/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/common/Card";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts";

const diseaseData = [
  { name: 'Respiratory', value: 400 },
  { name: 'Digestive', value: 300 },
  { name: 'Skin', value: 300 },
  { name: 'Infections', value: 200 },
];
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

export default function AdminDashboard() {
  const stats = [
    { title: "Total Users", value: "1,240", icon: Users, color: "primary" },
    { title: "Total Animals", value: "3,850", icon: List, color: "primary" },
    { title: "Active Cases", value: "142", icon: Activity, color: "warning" },
    { title: "Critical Cases", value: "28", icon: AlertTriangle, color: "critical" },
    { title: "Recovered", value: "2,150", icon: HeartPulse, color: "success" },
    { title: "Veterinarians", value: "85", icon: Stethoscope, color: "primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-medium text-slate-500">Filters:</span>
          <Select name="state" className="w-40"><option>All States</option><option>Maharashtra</option></Select>
          <Select name="district" className="w-40"><option>All Districts</option><option>Pune</option></Select>
          <Select name="animal" className="w-40"><option>All Animals</option><option>Cattle</option></Select>
          <Select name="disease" className="w-40"><option>All Diseases</option><option>FMD</option></Select>
          <Select name="date" className="w-40"><option>Last 30 Days</option><option>Last 7 Days</option></Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Disease Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={diseaseData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {diseaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>State-wise Animal Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {['Maharashtra', 'Gujarat', 'Karnataka', 'Madhya Pradesh'].map((state, i) => (
                 <div key={state} className="flex items-center">
                   <div className="w-32 text-sm font-medium text-slate-700">{state}</div>
                   <div className="flex-1 ml-4 h-4 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-primary-500 rounded-full" style={{width: `${100 - i*15}%`}}></div>
                   </div>
                   <div className="w-12 text-right text-sm text-slate-500 ml-4">{1000 - i*150}</div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Map className="w-5 h-5 text-red-500" /> Disease Hotspots</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
              <div><p className="font-bold text-red-900">Pune District</p><p className="text-sm text-red-700">23 Active Cases</p></div>
              <Badge variant="critical">CRITICAL</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div><p className="font-bold text-orange-900">Nashik District</p><p className="text-sm text-orange-700">14 Active Cases</p></div>
              <Badge variant="warning">WARNING</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CloudRain className="w-5 h-5 text-blue-500" /> Weather Risk</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-600">High Humidity Alert</span>
              <Badge variant="warning">Moderate</Badge>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-slate-600">Heavy Rainfall Zones</span>
              <Badge variant="critical">High Risk</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-2">Weather conditions are strongly correlating with new cases in Western region.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" /> Historical Trends</CardTitle></CardHeader>
          <CardContent>
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">FMD (Year over Year)</span>
                  <span className="text-sm font-bold text-red-600">+12%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Lumpy Skin Disease</span>
                  <span className="text-sm font-bold text-green-600">-25%</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>State-wise Risk Analysis</CardTitle></CardHeader>
          <CardContent>
             <div className="space-y-4">
               <div className="flex justify-between items-center"><span className="w-32">Maharashtra</span><div className="flex-1 mx-4 h-2 bg-slate-100 rounded"><div className="h-full bg-red-500 rounded" style={{width: '80%'}}></div></div><span>High</span></div>
               <div className="flex justify-between items-center"><span className="w-32">Gujarat</span><div className="flex-1 mx-4 h-2 bg-slate-100 rounded"><div className="h-full bg-yellow-500 rounded" style={{width: '45%'}}></div></div><span>Medium</span></div>
             </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Emerging Outbreaks</CardTitle></CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-bold text-slate-900 mb-1">Bluetongue in Sheep</h4>
              <p className="text-sm text-slate-600 mb-3">Detected in Nashik district. Spreading faster than last month.</p>
              <div className="flex gap-2">
                <Badge variant="critical">Urgent Action Required</Badge>
                <Badge variant="secondary">12 New Cases</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}