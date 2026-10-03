package com.pashucare.backend.dto;

import com.pashucare.backend.entity.enums.RiskLevel;

public class DiseaseResponseDTO {
    private Long id;
    private String animalType;
    private String diseaseName;
    private String description;
    private String symptoms;
    private RiskLevel riskLevel;
    private String prevention;
    private String verifiedRecommendation;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAnimalType() { return animalType; }
    public void setAnimalType(String animalType) { this.animalType = animalType; }
    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public String getPrevention() { return prevention; }
    public void setPrevention(String prevention) { this.prevention = prevention; }
    public String getVerifiedRecommendation() { return verifiedRecommendation; }
    public void setVerifiedRecommendation(String verifiedRecommendation) { this.verifiedRecommendation = verifiedRecommendation; }
}
