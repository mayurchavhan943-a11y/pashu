import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Bot, MapPin, Activity, AlertTriangle, Info, CheckCircle, Clock, Thermometer, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { animalService } from '../../services/animalService';
import api from '../../services/api';

export default function AIResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [animal, setAnimal] = useState(location.state?.selectedAnimal || null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const result = location.state?.result || null;
  const formData = location.state?.formData || {};

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!animal && id && id !== 'new') {
        try {
          const data = await animalService.getAnimalById(id);
          setAnimal(data);
        } catch (error) {
          console.error('Failed to fetch animal details:', error);
        }
      }
      setLoading(false);
    };
    fetchAnimal();
  }, [id, animal]);

  const handleSaveHealthReport = async () => {
    if (!animal || !result || isSaving || saveSuccess) return;
    setIsSaving(true);
    setSaveMessage('');

    try {
      const payload = {
        animalId: animal.id,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        symptoms: Array.isArray(formData.symptoms) ? formData.symptoms.join(', ') : (formData.symptoms || ''),
        behaviour: [formData.activityLevel, formData.appetite, formData.eatingBehaviour, formData.otherBehaviour].filter(Boolean).join(', '),
        duration: formData.duration || '',
        appetite: formData.appetite || '',
        activityLevel: formData.activityLevel || '',
        additionalInformation: `${result.predictedCondition} | Risk: ${result.riskLevel}`
      };
      
      const res = await api.post('/health-records', payload);
      
      if (res.data && res.data.id) {
        try {
          await api.post('/diagnoses', {
            healthRecordId: res.data.id,
            suspectedDisease: result.predictedCondition,
            confidence: result.confidence,
            severity: result.severity || result.riskLevel,
            explanation: result.explanation,
            recommendation: Array.isArray(result.recommendations) ? result.recommendations.join('\n') : (result.recommendations || ''),
            warning: result.disclaimer,
            veterinaryAttentionRecommended: result.veterinarianNeeded
          });
        } catch (diagError) {
          console.log('Diagnosis record note:', diagError.message);
        }
      }
      
      setSaveSuccess(true);
      setSaveMessage('Health Report and Diagnosis saved successfully!');
    } catch (error) {
      console.error('Failed to save health report:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save health report.';
      setSaveMessage('Error: ' + msg);
    } finally {
      setIsSaving(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'MODERATE': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center bg-white rounded-xl shadow-sm border border-slate-200">
        <Bot className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">No Assessment Data Available</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Please run a health check on one of your registered animals to generate an AI assessment.
        </p>
        <Button onClick={() => navigate('/health-check')}>Go to Health Check</Button>
      </div>
    );
  }

  const confidenceScore = result.confidence ? Math.round(result.confidence * 100) : 0;
  const animalName = animal?.name || animal?.nameOrTag || 'Animal';
  const animalSpecies = animal?.species || animal?.animalType || 'Species';

  const symptomsList = (result.matchedSymptoms && result.matchedSymptoms.length > 0)
    ? result.matchedSymptoms
    : (Array.isArray(formData.symptoms) && formData.symptoms.length > 0 ? formData.symptoms : ['No specific symptoms reported']);

  const behaviourList = (result.matchedBehaviourChanges && result.matchedBehaviourChanges.length > 0)
    ? result.matchedBehaviourChanges
    : [formData.activityLevel, formData.appetite, formData.eatingBehaviour, formData.otherBehaviour].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bot className="h-7 w-7 text-primary-600" /> AI Health Assessment
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Assessment complete for <strong className="text-slate-700">{animalName}</strong> ({animalSpecies}).
          </p>
        </div>
        <div className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full flex items-center w-fit border border-slate-200">
          <Clock className="h-3 w-3 mr-1" /> Generated {new Date().toLocaleTimeString()}
        </div>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-lg text-sm border flex items-center gap-2 ${saveSuccess ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {saveSuccess ? <CheckCircle className="h-5 w-5 text-green-600 shrink-0" /> : <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />}
          <span>{saveMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-t-4 border-t-primary-500 shadow-md">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Clinical Condition</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{result.predictedCondition}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center text-sm font-medium">
                      <span className="text-slate-500 mr-2">Risk Level:</span> 
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRiskColor(result.riskLevel)}`}>
                        {result.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-medium">
                      <span className="text-slate-500 mr-2">AI Confidence:</span> 
                      <span className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold">
                        {confidenceScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-primary-600" /> AI Assessment Overview
                  </h3>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {result.explanation || 'Based on the provided symptoms and behaviour metrics, an assessment was determined.'}
                  </p>
                </div>

                {/* Vitals Summary: Temperature & Duration */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-red-500 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Body Temperature</p>
                      <p className="font-semibold text-slate-900">
                        {formData.temperature ? `${formData.temperature}°C` : 'Not recorded'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary-500 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">Duration of Symptoms</p>
                      <p className="font-semibold text-slate-900">
                        {formData.duration || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Observed Symptoms */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center mb-3">
                      <Activity className="h-4 w-4 mr-2 text-slate-500" /> Observed Symptoms
                    </h3>
                    <ul className="space-y-1.5">
                      {symptomsList.map((symp, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary-500 mt-1.5 mr-2 shrink-0"></span>
                          {symp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Observed Behaviour */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center mb-3">
                      <Activity className="h-4 w-4 mr-2 text-amber-500" /> Behaviour Observations
                    </h3>
                    <ul className="space-y-1.5">
                      {behaviourList.length > 0 ? behaviourList.map((beh, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 mr-2 shrink-0"></span>
                          {beh}
                        </li>
                      )) : (
                        <li className="text-sm text-slate-500">Normal behaviour reported</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Immediate Care Recommendations */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center mb-3">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" /> Immediate Care Recommendations
                  </h3>
                  <div className="bg-green-50/50 rounded-lg p-4 border border-green-100 space-y-2">
                    {(result.recommendations || []).map((care, i) => (
                      <div key={i} className="flex items-start text-sm text-slate-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2.5 shrink-0" />
                        <span>{care}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Veterinary Recommendation Card */}
          <Card className={result.veterinarianNeeded ? "bg-amber-50/70 border-amber-200" : "bg-slate-50 border-slate-200"}>
            <CardContent className="p-6 flex gap-4">
              <AlertTriangle className={`h-8 w-8 shrink-0 ${result.veterinarianNeeded ? 'text-amber-600' : 'text-slate-400'}`} />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Veterinary Consultation Recommendation</h3>
                <p className="text-slate-700 text-sm">
                  {result.veterinarianNeeded 
                    ? "Veterinary medical attention is recommended based on the reported symptom severity and risk assessment."
                    : "No emergency veterinary consultation is currently flagged. Continue monitoring the animal's condition closely."}
                </p>
                {result.veterinarianNeeded && (
                  <Button className="mt-3" size="sm" onClick={() => navigate('/risk-map')}>
                    <MapPin className="mr-2 h-4 w-4" /> Find Nearby Veterinarian
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="bg-slate-100 p-4 rounded-lg text-xs text-slate-600 text-center flex items-center justify-center border border-slate-200">
            <Info className="h-4 w-4 mr-2 shrink-0 text-slate-400" />
            <p>{result.disclaimer || 'This is an AI-assisted preliminary assessment and is not a definitive veterinary diagnosis.'}</p>
          </div>
        </div>

        {/* Right Sidebar: Animal Profile & Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Animal Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {animalSpecies[0] || '?'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{animalName}</h4>
                  <p className="text-xs text-slate-500">ID: #{animal?.id || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                <div className="flex justify-between"><span className="text-slate-500">Species</span><span className="font-medium text-slate-900">{animalSpecies}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Breed</span><span className="font-medium text-slate-900">{animal?.breed || 'Standard'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Age</span><span className="font-medium text-slate-900">{animal?.age != null ? `${animal.age} yrs` : 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Weight</span><span className="font-medium text-slate-900">{animal?.weight ? `${animal.weight} kg` : 'N/A'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Gender</span><span className="font-medium text-slate-900">{animal?.gender || 'Male'}</span></div>
              </div>
              {animal?.id && (
                <Button variant="secondary" className="w-full mt-4" size="sm" onClick={() => navigate(`/animals/${animal.id}`)}>
                  View Full Profile
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant={saveSuccess ? 'outline' : 'primary'} 
                className="w-full justify-start text-left" 
                onClick={handleSaveHealthReport} 
                disabled={isSaving || saveSuccess}
              >
                {isSaving ? 'Saving Record...' : (saveSuccess ? 'Report Saved ✓' : 'Save Health Report')}
              </Button>
              <Button variant="secondary" className="w-full justify-start text-left" onClick={() => navigate('/history')}>
                View Health History
              </Button>
              <Button variant="secondary" className="w-full justify-start text-left" onClick={() => navigate('/health-check')}>
                Check Another Animal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
