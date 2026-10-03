import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { ANIMAL_CATEGORIES } from "../../data/animals";
import { Check, Camera, UploadCloud, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { cn } from "../../utils/cn";
import { animalService } from "../../services/animalService";

const STEPS = ["Species", "Details", "Photo", "Health", "Review"];

export default function AddAnimal() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    species: "",
    name: "",
    breed: "",
    gender: "Male",
    age: "",
    weight: "",
    vaccination: "",
    previousDiseases: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ANIMAL_CATEGORIES.map(cat => (
              <div 
                key={cat} 
                onClick={() => setFormData({...formData, species: cat})}
                className={cn(
                  "cursor-pointer rounded-xl border-2 p-4 text-center transition-all",
                  formData.species === cat ? "border-primary-500 bg-primary-50" : "border-slate-200 hover:border-primary-300"
                )}
              >
                <div className="h-12 w-12 bg-slate-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xs text-slate-500">{cat[0]}</span>
                </div>
                <span className="font-medium text-slate-900">{cat}</span>
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Animal Name or ID" name="name" value={formData.name} onChange={handleChange} required />
            <Input label="Breed" name="breed" value={formData.breed} onChange={handleChange} />
            <Select 
              label="Gender" name="gender" value={formData.gender} onChange={handleChange}
              options={[{value:"Male",label:"Male"}, {value:"Female",label:"Female"}]} 
            />
            <Input label="Age (Years)" name="age" type="number" value={formData.age} onChange={handleChange} />
            <Input label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} />
          </div>
        );
      case 2:
        return (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center">
            <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Take Photo or Upload Image</h4>
            <p className="text-slate-500 text-sm mt-2">JPG, PNG, WEBP up to 5MB (Optional)</p>
            <div className="flex gap-4 mt-6">
              <Button type="button" variant="secondary"><Camera className="mr-2 h-4 w-4"/> Use Camera</Button>
              <Button type="button" variant="secondary"><UploadCloud className="mr-2 h-4 w-4"/> Browse Files</Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Select 
              label="Vaccination Status" name="vaccination" value={formData.vaccination} onChange={handleChange}
              options={[
                {value:"",label:"Select Status"},
                {value:"Fully Vaccinated",label:"Fully Vaccinated"},
                {value:"Partially Vaccinated",label:"Partially Vaccinated"},
                {value:"Not Vaccinated",label:"Not Vaccinated"}
              ]} 
            />
            <div className="w-full">
              <label className="mb-2 block text-sm font-medium text-slate-700">Previous Health Issues (Optional)</label>
              <textarea 
                name="previousDiseases"
                value={formData.previousDiseases}
                onChange={handleChange}
                placeholder="e.g. Mild fever 2 months ago. Recovered."
                className="w-full rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="4"
              ></textarea>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Review Animal Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500">Species</p><p className="font-medium text-slate-900">{formData.species || "-"}</p></div>
              <div><p className="text-slate-500">Name</p><p className="font-medium text-slate-900">{formData.name || "-"}</p></div>
              <div><p className="text-slate-500">Breed</p><p className="font-medium text-slate-900">{formData.breed || "-"}</p></div>
              <div><p className="text-slate-500">Gender</p><p className="font-medium text-slate-900">{formData.gender || "-"}</p></div>
              <div><p className="text-slate-500">Age</p><p className="font-medium text-slate-900">{formData.age ? `${formData.age} yrs` : "-"}</p></div>
              <div><p className="text-slate-500">Weight</p><p className="font-medium text-slate-900">{formData.weight ? `${formData.weight} kg` : "-"}</p></div>
              <div className="col-span-2"><p className="text-slate-500">Vaccination</p><p className="font-medium text-slate-900">{formData.vaccination || "Not specified"}</p></div>
              {formData.previousDiseases && (
                <div className="col-span-2"><p className="text-slate-500">Previous Health</p><p className="font-medium text-slate-900">{formData.previousDiseases}</p></div>
              )}
            </div>
          </div>
        );
      default: return null;
    }
  };

  const submitForm = async () => {
    if (!formData.species) {
      setErrorMessage("Please select an animal species.");
      setCurrentStep(0);
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("Please enter an animal name or ID.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name.trim(),
        nameOrTag: formData.name.trim(),
        species: formData.species,
        animalType: formData.species,
        breed: formData.breed ? formData.breed.trim() : "",
        gender: formData.gender || "Male",
        age: formData.age ? parseInt(formData.age, 10) : 0,
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        location: formData.previousDiseases ? formData.previousDiseases.trim() : ""
      };

      const result = await animalService.createAnimal(payload);
      console.log("Animal saved successfully:", result);
      navigate("/animals");
    } catch (error) {
      console.error("Failed to save animal:", error);
      const serverMsg = error.response?.data?.message || 
                        (error.response?.data?.errors ? Object.values(error.response.data.errors).join(", ") : null) || 
                        error.message || "Failed to create animal";
      setErrorMessage(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Animal</h1>
        <p className="mt-1 text-sm text-slate-500">Register a new animal to track health and get AI insights.</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:w-full before:bg-slate-200 before:z-0">
          {STEPS.map((step, idx) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border-2 bg-white",
                idx < currentStep ? "bg-primary-600 border-primary-600 text-white" : 
                idx === currentStep ? "border-primary-600 text-primary-600" : "border-slate-300 text-slate-400"
              )}>
                {idx < currentStep ? <Check className="h-4 w-4" /> : (idx + 1)}
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium absolute -bottom-6 w-max text-center",
                idx <= currentStep ? "text-slate-900" : "text-slate-500"
              )}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle>{STEPS[currentStep]}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-slate-100 pt-6">
          <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0 || isSubmitting}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button onClick={submitForm} disabled={isSubmitting}>
              {isSubmitting ? "Saving Animal..." : "Save Animal"} <Check className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={currentStep === 0 && !formData.species}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}