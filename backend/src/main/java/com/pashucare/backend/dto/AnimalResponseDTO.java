package com.pashucare.backend.dto;

public class AnimalResponseDTO {
    private Long id;
    private Long userId;
    private String animalType;
    private String species;
    private String breed;
    private String nameOrTag;
    private String name;
    private Integer age;
    private String gender;
    private Double weight;
    private String location;
    private String healthStatus = "Healthy";

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAnimalType() { return animalType; }
    public void setAnimalType(String animalType) { 
        this.animalType = animalType;
        this.species = animalType;
    }

    public String getSpecies() { return species != null ? species : animalType; }
    public void setSpecies(String species) { 
        this.species = species;
        this.animalType = species;
    }

    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }

    public String getNameOrTag() { return nameOrTag; }
    public void setNameOrTag(String nameOrTag) { 
        this.nameOrTag = nameOrTag;
        this.name = nameOrTag;
    }

    public String getName() { return name != null ? name : nameOrTag; }
    public void setName(String name) { 
        this.name = name;
        this.nameOrTag = name;
    }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getHealthStatus() { return healthStatus; }
    public void setHealthStatus(String healthStatus) { this.healthStatus = healthStatus; }
}
