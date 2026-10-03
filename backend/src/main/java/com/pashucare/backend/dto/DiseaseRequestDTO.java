package com.pashucare.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DiseaseRequestDTO {

    @NotBlank(message = "Animal type is required")
    private String animalType;

    @NotBlank(message = "Disease name is required")
    private String diseaseName;

    private String description;
    private String symptoms;

    @NotBlank(message = "Risk level is required")
    private String riskLevel;

    private String prevention;
    private String verifiedRecommendation;

    // Getters and Setters
    public String getAnimalType() { return animalType; }
    public void setAnimalType(String animalType) { this.animalType = animalType; }
    public String getDiseaseName() { return diseaseName; }
    public void setDiseaseName(String diseaseName) { this.diseaseName = diseaseName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }
    public String getPrevention() { return prevention; }
    public void setPrevention(String prevention) { this.prevention = prevention; }
    public String getVerifiedRecommendation() { return verifiedRecommendation; }
    public void setVerifiedRecommendation(String verifiedRecommendation) { this.verifiedRecommendation = verifiedRecommendation; }
}
