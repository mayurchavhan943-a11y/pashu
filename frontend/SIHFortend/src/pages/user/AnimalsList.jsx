import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Badge } from "../../components/common/Badge";
import { animalService } from "../../services/animalService";

export default function AnimalsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecies, setFilterSpecies] = useState("");
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const data = await animalService.getAllAnimals();
      setAnimals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch animals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const filteredAnimals = animals.filter(animal => {
    const name = (animal.name || animal.nameOrTag || "").toString().toLowerCase();
    const idStr = (animal.id || "").toString().toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch = name.includes(term) || idStr.includes(term);

    const species = (animal.species || animal.animalType || "").toString();
    const matchesSpecies = filterSpecies ? species.toLowerCase() === filterSpecies.toLowerCase() : true;
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Animals</h1>
          <p className="mt-1 text-sm text-slate-500">Manage and monitor all your registered animals.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnimals} disabled={loading} title="Refresh list">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => navigate('/add-animal')}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Animal
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <Input 
            className="pl-10" 
            placeholder="Search by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48 relative">
          <Filter className="absolute left-3 top-2.5 h-5 w-5 text-slate-400 z-10" />
          <Select 
            className="pl-10" 
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            options={[
              { value: "", label: "All Species" },
              { value: "Horse", label: "Horse" },
              { value: "Cow", label: "Cow" },
              { value: "Buffalo", label: "Buffalo" },
              { value: "Dog", label: "Dog" },
              { value: "Cat", label: "Cat" },
              { value: "Goat", label: "Goat" },
              { value: "Sheep", label: "Sheep" },
              { value: "Chicken", label: "Chicken" }
            ]}
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading animals...</div>
      ) : filteredAnimals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No animals found</h3>
          <p className="text-sm text-slate-500 mb-6">
            {searchTerm || filterSpecies ? "No animals matched your filters." : "You have not registered any animals yet."}
          </p>
          <Button onClick={() => navigate('/add-animal')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Animal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimals.map(animal => {
            const name = animal.name || animal.nameOrTag || "Unnamed Animal";
            const species = animal.species || animal.animalType || "Unknown";
            const health = animal.healthStatus || "Healthy";
            return (
              <div key={animal.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-primary-50 relative flex items-center justify-center">
                  <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center font-bold text-2xl text-primary-600 shadow-sm">
                    {species[0] || "A"}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant={health === 'Healthy' ? 'success' : health === 'Critical' ? 'critical' : 'warning'}>
                      {health}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{name}</h3>
                    <p className="text-sm text-slate-500">ID: #{animal.id}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Species</p>
                      <p className="font-medium text-slate-900">{species}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Breed</p>
                      <p className="font-medium text-slate-900">{animal.breed || "Standard"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Age</p>
                      <p className="font-medium text-slate-900">{animal.age != null ? `${animal.age} yrs` : "-"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Gender</p>
                      <p className="font-medium text-slate-900">{animal.gender || "Male"}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <Button variant="secondary" className="flex-1 text-sm h-9" onClick={() => navigate(`/animals/${animal.id}`)}>
                      Details
                    </Button>
                    <Button className="flex-1 text-sm h-9" onClick={() => navigate(`/health-check?animal=${animal.id}`)}>
                      Check
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}