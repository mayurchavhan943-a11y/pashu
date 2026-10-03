package com.pashucare.backend.dto;

import com.pashucare.backend.entity.enums.Severity;

public class DiagnosisResponseDTO {
    private Long id;
    private Long healthRecordId;
    private String suspectedDisease;
    private Double confidence;
    private Severity severity;
    private String explanation;
    private String recommendation;
    private String warning;
    private Boolean veterinaryAttentionRecommended;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getHealthRecordId() { return healthRecordId; }
    public void setHealthRecordId(Long healthRecordId) { this.healthRecordId = healthRecordId; }
    public String getSuspectedDisease() { return suspectedDisease; }
    public void setSuspectedDisease(String suspectedDisease) { this.suspectedDisease = suspectedDisease; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public String getWarning() { return warning; }
    public void setWarning(String warning) { this.warning = warning; }
    public Boolean getVeterinaryAttentionRecommended() { return veterinaryAttentionRecommended; }
    public void setVeterinaryAttentionRecommended(Boolean veterinaryAttentionRecommended) { this.veterinaryAttentionRecommended = veterinaryAttentionRecommended; }
}
