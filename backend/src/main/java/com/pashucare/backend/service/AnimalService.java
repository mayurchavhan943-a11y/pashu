package com.pashucare.backend.service;

import com.pashucare.backend.dto.AnimalRequestDTO;
import com.pashucare.backend.dto.AnimalResponseDTO;
import com.pashucare.backend.entity.Animal;
import com.pashucare.backend.entity.User;
import com.pashucare.backend.exception.ResourceNotFoundException;
import com.pashucare.backend.repository.AnimalRepository;
import com.pashucare.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final UserRepository userRepository;

    public AnimalService(AnimalRepository animalRepository, UserRepository userRepository) {
        this.animalRepository = animalRepository;
        this.userRepository = userRepository;
    }

    public List<AnimalResponseDTO> getAllAnimals() {
        User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new org.springframework.security.access.AccessDeniedException("User is not authenticated.");
        }
        if (currentUser.getRole() != null && currentUser.getRole().name().equals("ADMIN")) {
            return animalRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
        }
        return animalRepository.findByUserId(currentUser.getId()).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public AnimalResponseDTO getAnimalById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found with id: " + id));
                
        User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new org.springframework.security.access.AccessDeniedException("User is not authenticated.");
        }
        if (currentUser.getRole() != null && !currentUser.getRole().name().equals("ADMIN") && !animal.getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to access this animal.");
        }
        return mapToDTO(animal);
    }

    @Transactional
    public AnimalResponseDTO createAnimal(AnimalRequestDTO requestDTO) {
        User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new org.springframework.security.access.AccessDeniedException("User is not authenticated.");
        }
        
        // If a normal user creates an animal, enforce the animal belongs to them.
        Long targetUserId = requestDTO.getUserId() != null ? requestDTO.getUserId() : currentUser.getId();
        if (currentUser.getRole() != null && !currentUser.getRole().name().equals("ADMIN") && !targetUserId.equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You can only create animals for yourself.");
        }
        
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        String name = requestDTO.getNameOrTag();
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Animal name is required.");
        }
        String species = requestDTO.getAnimalType();
        if (species == null || species.trim().isEmpty()) {
            throw new IllegalArgumentException("Animal species/type is required.");
        }

        Animal animal = new Animal();
        animal.setUser(user);
        animal.setAnimalType(species);
        animal.setBreed(requestDTO.getBreed());
        animal.setNameOrTag(name);
        animal.setAge(requestDTO.getAge());
        animal.setGender(requestDTO.getGender());
        animal.setWeight(requestDTO.getWeight());
        animal.setLocation(requestDTO.getLocation());

        Animal savedAnimal = animalRepository.save(animal);
        return mapToDTO(savedAnimal);
    }

    @Transactional
    public AnimalResponseDTO updateAnimal(Long id, AnimalRequestDTO requestDTO) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found with id: " + id));

        User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new org.springframework.security.access.AccessDeniedException("User is not authenticated.");
        }
        if (currentUser.getRole() != null && !currentUser.getRole().name().equals("ADMIN") && !animal.getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to update this animal.");
        }

        if (requestDTO.getAnimalType() != null) {
            animal.setAnimalType(requestDTO.getAnimalType());
        }
        if (requestDTO.getBreed() != null) {
            animal.setBreed(requestDTO.getBreed());
        }
        if (requestDTO.getNameOrTag() != null) {
            animal.setNameOrTag(requestDTO.getNameOrTag());
        }
        if (requestDTO.getAge() != null) {
            animal.setAge(requestDTO.getAge());
        }
        if (requestDTO.getGender() != null) {
            animal.setGender(requestDTO.getGender());
        }
        if (requestDTO.getWeight() != null) {
            animal.setWeight(requestDTO.getWeight());
        }
        if (requestDTO.getLocation() != null) {
            animal.setLocation(requestDTO.getLocation());
        }

        Animal updatedAnimal = animalRepository.save(animal);
        return mapToDTO(updatedAnimal);
    }

    @Transactional
    public void deleteAnimal(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found with id: " + id));
                
        User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new org.springframework.security.access.AccessDeniedException("User is not authenticated.");
        }
        if (currentUser.getRole() != null && !currentUser.getRole().name().equals("ADMIN") && !animal.getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to delete this animal.");
        }
        animalRepository.delete(animal);
    }

    private AnimalResponseDTO mapToDTO(Animal animal) {
        AnimalResponseDTO dto = new AnimalResponseDTO();
        dto.setId(animal.getId());
        dto.setUserId(animal.getUser() != null ? animal.getUser().getId() : null);
        dto.setAnimalType(animal.getAnimalType());
        dto.setSpecies(animal.getAnimalType());
        dto.setBreed(animal.getBreed());
        dto.setNameOrTag(animal.getNameOrTag());
        dto.setName(animal.getNameOrTag());
        dto.setAge(animal.getAge());
        dto.setGender(animal.getGender());
        dto.setWeight(animal.getWeight());
        dto.setLocation(animal.getLocation());
        dto.setHealthStatus("Healthy");
        return dto;
    }
}
