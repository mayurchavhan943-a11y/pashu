package com.pashucare.backend.dto;

public class AIRequestDTO {
    private String animalType;
    private String breed;
    private Integer age;
    private String gender;
    private String symptoms;
    private String behaviourChanges;
    private String duration;
    private Double temperature;
    private String photoPath;
    
    // New fields
    private Long animalId;
    private Double weight;
    private String symptomDescription;
    private String activityLevel;
    private String appetite;
    private String eatingBehaviour;
    private String otherBehaviour;

    public String getAnimalType() { return animalType; }
    public void setAnimalType(String animalType) { this.animalType = animalType; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getBehaviourChanges() { return behaviourChanges; }
    public void setBehaviourChanges(String behaviourChanges) { this.behaviourChanges = behaviourChanges; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }

    public Long getAnimalId() { return animalId; }
    public void setAnimalId(Long animalId) { this.animalId = animalId; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getSymptomDescription() { return symptomDescription; }
    public void setSymptomDescription(String symptomDescription) { this.symptomDescription = symptomDescription; }

    public String getActivityLevel() { return activityLevel; }
    public void setActivityLevel(String activityLevel) { this.activityLevel = activityLevel; }

    public String getAppetite() { return appetite; }
    public void setAppetite(String appetite) { this.appetite = appetite; }

    public String getEatingBehaviour() { return eatingBehaviour; }
    public void setEatingBehaviour(String eatingBehaviour) { this.eatingBehaviour = eatingBehaviour; }

    public String getOtherBehaviour() { return otherBehaviour; }
    public void setOtherBehaviour(String otherBehaviour) { this.otherBehaviour = otherBehaviour; }
}
