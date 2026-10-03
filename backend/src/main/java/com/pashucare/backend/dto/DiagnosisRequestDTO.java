package com.pashucare.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DiagnosisRequestDTO {

    @NotNull(message = "Health Record ID is required")
    private Long healthRecordId;

    @NotBlank(message = "Suspected disease is required")
    private String suspectedDisease;

    private Double confidence;

    @NotBlank(message = "Severity is required")
    private String severity;

    private String explanation;
    private String recommendation;
    private String warning;
    private Boolean veterinaryAttentionRecommended;

    // Getters and Setters
    public Long getHealthRecordId() { return healthRecordId; }
    public void setHealthRecordId(Long healthRecordId) { this.healthRecordId = healthRecordId; }
    public String getSuspectedDisease() { return suspectedDisease; }
    public void setSuspectedDisease(String suspectedDisease) { this.suspectedDisease = suspectedDisease; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public String getWarning() { return warning; }
    public void setWarning(String warning) { this.warning = warning; }
    public Boolean getVeterinaryAttentionRecommended() { return veterinaryAttentionRecommended; }
    public void setVeterinaryAttentionRecommended(Boolean veterinaryAttentionRecommended) { this.veterinaryAttentionRecommended = veterinaryAttentionRecommended; }
}
