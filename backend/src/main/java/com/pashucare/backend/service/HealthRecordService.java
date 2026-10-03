package com.pashucare.backend.service;

import com.pashucare.backend.dto.HealthRecordRequestDTO;
import com.pashucare.backend.dto.HealthRecordResponseDTO;
import com.pashucare.backend.entity.Animal;
import com.pashucare.backend.entity.HealthRecord;
import com.pashucare.backend.exception.ResourceNotFoundException;
import com.pashucare.backend.repository.AnimalRepository;
import com.pashucare.backend.repository.HealthRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final AnimalRepository animalRepository;

    public HealthRecordService(HealthRecordRepository healthRecordRepository, AnimalRepository animalRepository) {
        this.healthRecordRepository = healthRecordRepository;
        this.animalRepository = animalRepository;
    }

    public List<HealthRecordResponseDTO> getHealthRecordsByAnimalId(Long animalId) {
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found with id: " + animalId));
                
        checkAccess(animal);
        return healthRecordRepository.findByAnimalId(animalId).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public HealthRecordResponseDTO getHealthRecordById(Long id) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health Record not found with id: " + id));
                
        checkAccess(record.getAnimal());
        return mapToDTO(record);
    }

    @Transactional
    public HealthRecordResponseDTO createHealthRecord(HealthRecordRequestDTO requestDTO) {
        Animal animal = animalRepository.findById(requestDTO.getAnimalId())
                .orElseThrow(() -> new ResourceNotFoundException("Animal not found with id: " + requestDTO.getAnimalId()));

        checkAccess(animal);

        HealthRecord record = new HealthRecord();
        record.setAnimal(animal);
        record.setTemperature(requestDTO.getTemperature());
        record.setSymptoms(requestDTO.getSymptoms());
        record.setBehaviour(requestDTO.getBehaviour());
        record.setDuration(requestDTO.getDuration());
        record.setAppetite(requestDTO.getAppetite());
        record.setWaterIntake(requestDTO.getWaterIntake());
        record.setActivityLevel(requestDTO.getActivityLevel());
        record.setAdditionalInformation(requestDTO.getAdditionalInformation());
        record.setImageUrl(requestDTO.getImageUrl());

        HealthRecord savedRecord = healthRecordRepository.save(record);
        return mapToDTO(savedRecord);
    }

    @Transactional
    public HealthRecordResponseDTO updateHealthRecord(Long id, HealthRecordRequestDTO requestDTO) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health Record not found with id: " + id));

        checkAccess(record.getAnimal());

        record.setTemperature(requestDTO.getTemperature());
        record.setSymptoms(requestDTO.getSymptoms());
        record.setBehaviour(requestDTO.getBehaviour());
        record.setDuration(requestDTO.getDuration());
        record.setAppetite(requestDTO.getAppetite());
        record.setWaterIntake(requestDTO.getWaterIntake());
        record.setActivityLevel(requestDTO.getActivityLevel());
        record.setAdditionalInformation(requestDTO.getAdditionalInformation());
        record.setImageUrl(requestDTO.getImageUrl());

        HealthRecord updatedRecord = healthRecordRepository.save(record);
        return mapToDTO(updatedRecord);
    }

    @Transactional
    public void deleteHealthRecord(Long id) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health Record not found with id: " + id));

        checkAccess(record.getAnimal());
        healthRecordRepository.delete(record);
    }

    private void checkAccess(Animal animal) {
        com.pashucare.backend.entity.User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new org.springframework.security.access.AccessDeniedException("User is not authenticated.");
        }
        if (currentUser.getRole() != null && !currentUser.getRole().name().equals("ADMIN") && !animal.getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to access these health records.");
        }
    }

    private HealthRecordResponseDTO mapToDTO(HealthRecord record) {
        HealthRecordResponseDTO dto = new HealthRecordResponseDTO();
        dto.setId(record.getId());
        dto.setAnimalId(record.getAnimal().getId());
        dto.setTemperature(record.getTemperature());
        dto.setSymptoms(record.getSymptoms());
        dto.setBehaviour(record.getBehaviour());
        dto.setDuration(record.getDuration());
        dto.setAppetite(record.getAppetite());
        dto.setWaterIntake(record.getWaterIntake());
        dto.setActivityLevel(record.getActivityLevel());
        dto.setAdditionalInformation(record.getAdditionalInformation());
        dto.setImageUrl(record.getImageUrl());
        dto.setCreatedAt(record.getCreatedAt());
        return dto;
    }
}
