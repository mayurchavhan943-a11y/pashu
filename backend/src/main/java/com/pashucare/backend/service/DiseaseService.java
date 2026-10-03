package com.pashucare.backend.service;
import com.pashucare.backend.dto.DiseaseResponseDTO;
import com.pashucare.backend.entity.Disease;
import com.pashucare.backend.repository.DiseaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DiseaseService {

    private final DiseaseRepository diseaseRepository;

    public DiseaseService(DiseaseRepository diseaseRepository) {
        this.diseaseRepository = diseaseRepository;
    }

    public List<DiseaseResponseDTO> getAllDiseases(String animalType) {
        if (animalType != null && !animalType.isBlank()) {
            return diseaseRepository.findByAnimalTypeIgnoreCase(animalType).stream().map(this::mapToDTO).collect(Collectors.toList());
        }
        return diseaseRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public DiseaseResponseDTO getDiseaseById(Long id) {
        Disease disease = diseaseRepository.findById(id)
                .orElseThrow(() -> new com.pashucare.backend.exception.ResourceNotFoundException("Disease not found with id: " + id));
        return mapToDTO(disease);
    }

    public DiseaseResponseDTO createDisease(com.pashucare.backend.dto.DiseaseRequestDTO requestDTO) {
        checkAdmin();
        Disease disease = new Disease();
        updateEntityFromDTO(disease, requestDTO);
        return mapToDTO(diseaseRepository.save(disease));
    }

    public DiseaseResponseDTO updateDisease(Long id, com.pashucare.backend.dto.DiseaseRequestDTO requestDTO) {
        checkAdmin();
        Disease disease = diseaseRepository.findById(id)
                .orElseThrow(() -> new com.pashucare.backend.exception.ResourceNotFoundException("Disease not found with id: " + id));
        updateEntityFromDTO(disease, requestDTO);
        return mapToDTO(diseaseRepository.save(disease));
    }

    public void deleteDisease(Long id) {
        checkAdmin();
        Disease disease = diseaseRepository.findById(id)
                .orElseThrow(() -> new com.pashucare.backend.exception.ResourceNotFoundException("Disease not found with id: " + id));
        diseaseRepository.delete(disease);
    }

    private void updateEntityFromDTO(Disease disease, com.pashucare.backend.dto.DiseaseRequestDTO requestDTO) {
        disease.setAnimalType(requestDTO.getAnimalType());
        disease.setDiseaseName(requestDTO.getDiseaseName());
        disease.setDescription(requestDTO.getDescription());
        disease.setSymptoms(requestDTO.getSymptoms());
        try {
            disease.setRiskLevel(com.pashucare.backend.entity.enums.RiskLevel.valueOf(requestDTO.getRiskLevel().toUpperCase()));
        } catch (IllegalArgumentException e) {
            disease.setRiskLevel(com.pashucare.backend.entity.enums.RiskLevel.MODERATE);
        }
        disease.setPrevention(requestDTO.getPrevention());
        disease.setVerifiedRecommendation(requestDTO.getVerifiedRecommendation());
    }

    private void checkAdmin() {
        com.pashucare.backend.entity.User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null || !currentUser.getRole().name().equals("ADMIN")) {
            throw new org.springframework.security.access.AccessDeniedException("Only admins can modify diseases.");
        }
    }

    private DiseaseResponseDTO mapToDTO(Disease disease) {
        DiseaseResponseDTO dto = new DiseaseResponseDTO();
        dto.setId(disease.getId());
        dto.setAnimalType(disease.getAnimalType());
        dto.setDiseaseName(disease.getDiseaseName());
        dto.setDescription(disease.getDescription());
        dto.setSymptoms(disease.getSymptoms());
        dto.setRiskLevel(disease.getRiskLevel());
        dto.setPrevention(disease.getPrevention());
        dto.setVerifiedRecommendation(disease.getVerifiedRecommendation());
        return dto;
    }
}
