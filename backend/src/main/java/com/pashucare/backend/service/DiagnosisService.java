package com.pashucare.backend.service;

import com.pashucare.backend.dto.DiagnosisResponseDTO;
import com.pashucare.backend.entity.Diagnosis;
import com.pashucare.backend.exception.ResourceNotFoundException;
import com.pashucare.backend.repository.DiagnosisRepository;
import org.springframework.stereotype.Service;

@Service
public class DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;

    public DiagnosisService(DiagnosisRepository diagnosisRepository) {
        this.diagnosisRepository = diagnosisRepository;
    }

    public DiagnosisResponseDTO getDiagnosisById(Long id) {
        Diagnosis diagnosis = diagnosisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found with id: " + id));
        checkAccess(diagnosis.getHealthRecord());
        return mapToDTO(diagnosis);
    }
    
    public DiagnosisResponseDTO getDiagnosisByHealthRecordId(Long healthRecordId) {
        Diagnosis diagnosis = diagnosisRepository.findByHealthRecordId(healthRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found for health record id: " + healthRecordId));
        checkAccess(diagnosis.getHealthRecord());
        return mapToDTO(diagnosis);
    }

    @org.springframework.transaction.annotation.Transactional
    public DiagnosisResponseDTO createDiagnosis(com.pashucare.backend.dto.DiagnosisRequestDTO requestDTO, com.pashucare.backend.repository.HealthRecordRepository healthRecordRepository) {
        com.pashucare.backend.entity.HealthRecord record = healthRecordRepository.findById(requestDTO.getHealthRecordId())
                .orElseThrow(() -> new ResourceNotFoundException("Health Record not found with id: " + requestDTO.getHealthRecordId()));
        
        checkAccess(record);

        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setHealthRecord(record);
        diagnosis.setSuspectedDisease(requestDTO.getSuspectedDisease());
        diagnosis.setConfidence(requestDTO.getConfidence());
        try {
            diagnosis.setSeverity(com.pashucare.backend.entity.enums.Severity.valueOf(requestDTO.getSeverity().toUpperCase()));
        } catch (IllegalArgumentException e) {
            diagnosis.setSeverity(com.pashucare.backend.entity.enums.Severity.MODERATE); // Default or throw error
        }
        diagnosis.setExplanation(requestDTO.getExplanation());
        diagnosis.setRecommendation(requestDTO.getRecommendation());
        diagnosis.setWarning(requestDTO.getWarning());
        diagnosis.setVeterinaryAttentionRecommended(requestDTO.getVeterinaryAttentionRecommended());

        Diagnosis savedDiagnosis = diagnosisRepository.save(diagnosis);
        return mapToDTO(savedDiagnosis);
    }
    
    private void checkAccess(com.pashucare.backend.entity.HealthRecord record) {
        com.pashucare.backend.entity.User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser != null && !currentUser.getRole().name().equals("ADMIN") && !record.getAnimal().getUser().getId().equals(currentUser.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not have permission to access this diagnosis.");
        }
    }

    private DiagnosisResponseDTO mapToDTO(Diagnosis diagnosis) {
        DiagnosisResponseDTO dto = new DiagnosisResponseDTO();
        dto.setId(diagnosis.getId());
        dto.setHealthRecordId(diagnosis.getHealthRecord().getId());
        dto.setSuspectedDisease(diagnosis.getSuspectedDisease());
        dto.setConfidence(diagnosis.getConfidence());
        dto.setSeverity(diagnosis.getSeverity());
        dto.setExplanation(diagnosis.getExplanation());
        dto.setRecommendation(diagnosis.getRecommendation());
        dto.setWarning(diagnosis.getWarning());
        dto.setVeterinaryAttentionRecommended(diagnosis.getVeterinaryAttentionRecommended());
        return dto;
    }
}
