package com.pashucare.backend.dto;

import jakarta.validation.constraints.PositiveOrZero;

public class AnimalRequestDTO {
    
    // User ID is optional; defaults to authenticated user from JWT
    private Long userId;

    private String animalType;
    private String species;

    private String breed;

    private String nameOrTag;
    private String name;

    @PositiveOrZero(message = "Age must be zero or positive")
    private Integer age;

    private String gender;

    @PositiveOrZero(message = "Weight must be zero or positive")
    private Double weight;

    private String location;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAnimalType() {
        if (animalType != null && !animalType.trim().isEmpty()) {
            return animalType;
        }
        return species;
    }
    public void setAnimalType(String animalType) { this.animalType = animalType; }

    public String getSpecies() {
        return getAnimalType();
    }
    public void setSpecies(String species) { this.species = species; }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public String getNameOrTag() {
        if (nameOrTag != null && !nameOrTag.trim().isEmpty()) {
            return nameOrTag;
        }
        return name;
    }
    public void setNameOrTag(String nameOrTag) { this.nameOrTag = nameOrTag; }

    public String getName() {
        return getNameOrTag();
    }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
