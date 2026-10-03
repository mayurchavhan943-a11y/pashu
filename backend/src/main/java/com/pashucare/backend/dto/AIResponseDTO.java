package com.pashucare.backend.dto;

import com.pashucare.backend.entity.enums.RiskLevel;
import com.pashucare.backend.entity.enums.Severity;
import java.util.List;

public class AIResponseDTO {
    private RiskLevel riskLevel;
    private String predictedCondition;
    private Severity severity;
    private Double confidence;
    private List<String> recommendations;
    private boolean veterinarianNeeded;
    private List<String> matchedSymptoms;
    private List<String> matchedBehaviourChanges;
    private String explanation;
    private String disclaimer;

    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }

    public String getPredictedCondition() { return predictedCondition; }
    public void setPredictedCondition(String predictedCondition) { this.predictedCondition = predictedCondition; }

    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public boolean isVeterinarianNeeded() { return veterinarianNeeded; }
    public void setVeterinarianNeeded(boolean veterinarianNeeded) { this.veterinarianNeeded = veterinarianNeeded; }

    public List<String> getMatchedSymptoms() { return matchedSymptoms; }
    public void setMatchedSymptoms(List<String> matchedSymptoms) { this.matchedSymptoms = matchedSymptoms; }

    public List<String> getMatchedBehaviourChanges() { return matchedBehaviourChanges; }
    public void setMatchedBehaviourChanges(List<String> matchedBehaviourChanges) { this.matchedBehaviourChanges = matchedBehaviourChanges; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
