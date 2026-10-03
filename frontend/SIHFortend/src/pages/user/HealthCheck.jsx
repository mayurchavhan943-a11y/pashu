import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { VoiceTextarea } from '../../components/common/VoiceTextarea';
import { SYMPTOMS_BY_SPECIES } from '../../data/symptoms';
import { Check, Camera, UploadCloud, ChevronRight, ChevronLeft, Bot, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { aiPredictionService } from '../../services/aiService';
import { animalService } from '../../services/animalService';

const STEPS = ['Animal', 'Photo', 'Symptoms', 'Behaviour', 'Review'];

export default function HealthCheck() {
  const [searchParams] = useSearchParams();
  const initialAnimal = searchParams.get('animal');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [animals, setAnimals] = useState([]);
  const [formData, setFormData] = useState({
    animalId: initialAnimal || '',
    symptoms: [],
    description: '',
    activityLevel: '',
    appetite: '',
    eatingBehaviour: '',
    otherBehaviour: '',
    duration: '',
    temperature: '',
    photoUploaded: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const data = await animalService.getAllAnimals();
        const list = Array.isArray(data) ? data : [];
        setAnimals(list);
        if (initialAnimal && !formData.animalId) {
          setFormData(prev => ({ ...prev, animalId: initialAnimal }));
        }
      } catch (error) {
        console.error('Failed to fetch animals', error);
      }
    };
    fetchAnimals();
  }, [initialAnimal]);

  const selectedAnimal = animals.find(a => String(a.id) === String(formData.animalId));
  const animalSpecies = selectedAnimal?.species || selectedAnimal?.animalType || 'Other';
  const matchedSpeciesKey = Object.keys(SYMPTOMS_BY_SPECIES).find(
    k => k.toLowerCase() === animalSpecies.toLowerCase()
  ) || 'Other';
  const availableSymptoms = SYMPTOMS_BY_SPECIES[matchedSpeciesKey] || SYMPTOMS_BY_SPECIES.Other || [];

  const handleNext = () => {
    setApiError('');
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };
  const handlePrev = () => {
    setApiError('');
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const toggleSymptom = (symptom) => {
    setFormData(prev => {
      const exists = prev.symptoms.includes(symptom);
      if (exists) {
        return { ...prev, symptoms: prev.symptoms.filter(s => s !== symptom) };
      } else {
        return { ...prev, symptoms: [...prev.symptoms, symptom] };
      }
    });
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">Select which animal you want to evaluate.</p>
            <Select 
              value={formData.animalId}
              onChange={(e) => setFormData({...formData, animalId: e.target.value})}
              options={[
                { value: "", label: "Select Animal..." },
                ...animals.map(a => ({
                  value: a.id, 
                  label: `${a.name || a.nameOrTag} (${a.species || a.animalType})`
                }))
              ]}
            />
            {selectedAnimal && (
              <div className="p-4 bg-primary-50 rounded-lg flex items-center gap-4 mt-4 border border-primary-100">
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center font-bold text-primary-600 shadow-sm">
                  {(selectedAnimal.species || selectedAnimal.animalType || "A")[0]}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{selectedAnimal.name || selectedAnimal.nameOrTag}</h4>
                  <p className="text-xs text-slate-500">
                    {selectedAnimal.species || selectedAnimal.animalType} • {selectedAnimal.age != null ? `${selectedAnimal.age} yrs` : 'Age N/A'} • {selectedAnimal.healthStatus || 'Healthy'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center">
            <div className="h-16 w-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Take Photo or Upload Image</h4>
            <p className="text-slate-500 text-sm mt-2">Optional: Uploading an image helps AI identify visible lesions and symptoms.</p>
            <div className="flex gap-4 mt-6">
              <Button type="button" variant="secondary" onClick={() => setFormData(prev => ({...prev, photoUploaded: true}))}>
                <Camera className="mr-2 h-4 w-4"/> Camera
              </Button>
              <Button type="button" variant="secondary" onClick={() => setFormData(prev => ({...prev, photoUploaded: true}))}>
                <UploadCloud className="mr-2 h-4 w-4"/> Browse
              </Button>
            </div>
            {formData.photoUploaded && (
              <p className="text-xs text-green-600 font-medium mt-3 flex items-center">
                <Check className="h-3 w-3 mr-1" /> Image attached for assessment
              </p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Select observed symptoms</label>
              <div className="flex flex-wrap gap-2">
                {availableSymptoms.map(symp => (
                  <button
                    key={symp}
                    type="button"
                    onClick={() => toggleSymptom(symp)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
                      formData.symptoms.includes(symp) 
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm' 
                        : 'bg-white text-slate-700 border-slate-300 hover:border-primary-300'
                    )}
                  >
                    {symp}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Body Temperature (°C) (Optional)</label>
              <input 
                type="number" step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                placeholder="e.g. 40.2"
                className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-slate-500 mt-1">Normal baseline: ~38.0 - 39.2°C depending on species</p>
            </div>
            <VoiceTextarea 
              id="animal-symptom-description"
              label="Describe what is happening (Optional)"
              value={formData.description}
              onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
              placeholder="Describe your animal's behaviour, specific symptoms, and recent observations..."
              rows={4}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Select 
              label="Activity Level" 
              value={formData.activityLevel} 
              onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}
              options={[
                {value:'',label:'Select Activity Level'},
                {value:'Normal',label:'Normal'},
                {value:'Slightly reduced',label:'Slightly reduced'},
                {value:'Reduced activity',label:'Reduced activity'},
                {value:'Very inactive',label:'Very inactive'}
              ]} 
            />
            <Select 
              label="Appetite / Feeding" 
              value={formData.appetite} 
              onChange={(e) => setFormData({...formData, appetite: e.target.value})}
              options={[
                {value:'',label:'Select Appetite'},
                {value:'Normal',label:'Normal'},
                {value:'Reduced appetite',label:'Reduced appetite'},
                {value:'Not eating',label:'Not eating'},
                {value:'Increased appetite',label:'Increased appetite'}
              ]} 
            />
            <Select 
              label="Eating Behaviour" 
              value={formData.eatingBehaviour} 
              onChange={(e) => setFormData({...formData, eatingBehaviour: e.target.value})}
              options={[
                {value:'',label:'Select Eating Behaviour'},
                {value:'Normal',label:'Normal'},
                {value:'Eating slowly',label:'Eating slowly'},
                {value:'Difficulty eating',label:'Difficulty eating'},
                {value:'Refusing feed',label:'Refusing feed'}
              ]} 
            />
            <Select 
              label="Other Behaviour" 
              value={formData.otherBehaviour} 
              onChange={(e) => setFormData({...formData, otherBehaviour: e.target.value})}
              options={[
                {value:'',label:'Select Other Behaviour'},
                {value:'Normal',label:'Normal'},
                {value:'Head down',label:'Head down'},
                {value:'Isolation',label:'Isolation'},
                {value:'Restlessness',label:'Restlessness'},
                {value:'Aggression',label:'Aggression'},
                {value:'Excessive vocalization',label:'Excessive vocalization'},
                {value:'Abnormal movement',label:'Abnormal movement'}
              ]} 
            />
            <Select 
              label="Duration of Symptoms" 
              value={formData.duration} 
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              options={[
                {value:'',label:'Select Duration'},
                {value:'Less than 1 day',label:'Less than 1 day'},
                {value:'1-3 days',label:'1-3 days'},
                {value:'3-7 days',label:'3-7 days'},
                {value:'More than 1 week',label:'More than 1 week'},
                {value:'More than 2 weeks',label:'More than 2 weeks'}
              ]} 
            />
          </div>
        );
      case 4:
        return (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-lg text-slate-900 mb-4">Review Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Animal</span>
                <span className="font-medium text-slate-900">
                  {selectedAnimal ? `${selectedAnimal.name || selectedAnimal.nameOrTag} (${selectedAnimal.species || selectedAnimal.animalType})` : 'Not selected'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Symptoms</span>
                <span className="font-medium text-slate-900 text-right max-w-xs">
                  {formData.symptoms.length > 0 ? formData.symptoms.join(', ') : 'None selected'}
                </span>
              </div>
              {formData.description && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Description</span>
                  <span className="font-medium text-slate-900 text-right max-w-xs truncate">{formData.description}</span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Activity Level</span>
                <span className="font-medium text-slate-900">{formData.activityLevel || 'Normal'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Appetite</span>
                <span className="font-medium text-slate-900">{formData.appetite || 'Normal'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Eating Behaviour</span>
                <span className="font-medium text-slate-900">{formData.eatingBehaviour || 'Normal'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Other Behaviour</span>
                <span className="font-medium text-slate-900">{formData.otherBehaviour || 'Normal'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium text-slate-900">{formData.duration || 'Not specified'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Temperature</span>
                <span className="font-medium text-slate-900">{formData.temperature ? `${formData.temperature}°C` : 'Not recorded'}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-500">Photo Status</span>
                <span className="font-medium text-slate-900">{formData.photoUploaded ? 'Photo attached' : 'No photo uploaded'}</span>
              </div>
            </div>
            
            {isAnalyzing && (
              <div className="mt-8 flex flex-col items-center justify-center p-6 bg-white rounded-lg border border-primary-200 shadow-sm animate-pulse">
                <Bot className="h-12 w-12 text-primary-600 mb-3 animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900">Analyzing animal health...</h4>
                <p className="text-sm text-slate-500 mt-1 text-center">Evaluating symptoms and behaviour to prepare an AI assessment.</p>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  const analyzeHealth = async () => {
    if (!selectedAnimal) {
      setApiError("Please select an animal first.");
      setCurrentStep(0);
      return;
    }

    setIsAnalyzing(true);
    setApiError('');

    try {
      const payload = {
        animalId: selectedAnimal.id,
        animalType: selectedAnimal.species || selectedAnimal.animalType || '',
        breed: selectedAnimal.breed || '',
        age: selectedAnimal.age != null ? selectedAnimal.age : 0,
        gender: selectedAnimal.gender || '',
        weight: selectedAnimal.weight || 0,
        symptoms: formData.symptoms.join(', '),
        symptomDescription: formData.description,
        activityLevel: formData.activityLevel || '',
        appetite: formData.appetite || '',
        eatingBehaviour: formData.eatingBehaviour || '',
        otherBehaviour: formData.otherBehaviour || '',
        duration: formData.duration || '',
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        photoPath: ''
      };

      const result = await aiPredictionService.predictHealth(payload);
      navigate(`/health-result/new`, { state: { result, formData, selectedAnimal } });
    } catch (error) {
      console.error('AI prediction failed:', error);
      let userMsg = 'Failed to analyze health.';
      if (error.response?.status === 401) {
        userMsg = 'Session expired. Please log in again.';
      } else if (error.response?.status === 400) {
        userMsg = 'Validation error: ' + (error.response?.data?.message || 'Please check submitted values.');
      } else if (error.response?.status === 503 || error.code === 'ECONNREFUSED' || !error.response) {
        userMsg = 'AI service is currently unavailable. Please start the AI service and try again.';
      } else {
        userMsg = error.response?.data?.message || 'AI service is currently unavailable. Please start the AI service and try again.';
      }
      setApiError(userMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">AI Animal Health Check</h1>
        <p className="mt-1 text-sm text-slate-500">Provide details for the AI to assess possible conditions.</p>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center relative before:absolute before:inset-0 before:top-1/2 before:-translate-y-1/2 before:h-0.5 before:w-full before:bg-slate-200 before:z-0">
          {STEPS.map((step, idx) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border-2 bg-white',
                idx < currentStep ? 'bg-primary-600 border-primary-600 text-white' : 
                idx === currentStep ? 'border-primary-600 text-primary-600' : 'border-slate-300 text-slate-400'
              )}>
                {idx < currentStep ? <Check className="h-4 w-4" /> : (idx + 1)}
              </div>
              <span className={cn(
                'mt-2 text-xs font-medium absolute -bottom-6 w-max text-center',
                idx <= currentStep ? 'text-slate-900' : 'text-slate-500',
                'hidden sm:block'
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
          <Button variant="ghost" onClick={handlePrev} disabled={currentStep === 0 || isAnalyzing}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          {currentStep === STEPS.length - 1 ? (
            <Button onClick={analyzeHealth} disabled={!formData.animalId || isAnalyzing}>
              {isAnalyzing ? 'Analyzing animal health...' : 'Analyze Health'} <Bot className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={currentStep === 0 && !formData.animalId}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
