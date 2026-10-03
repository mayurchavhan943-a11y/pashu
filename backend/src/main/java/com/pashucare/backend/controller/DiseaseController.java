package com.pashucare.backend.controller;
import com.pashucare.backend.dto.DiseaseResponseDTO;
import com.pashucare.backend.service.DiseaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/diseases")
public class DiseaseController {

    private final DiseaseService diseaseService;

    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

    @GetMapping
    public ResponseEntity<List<DiseaseResponseDTO>> getAllDiseases(@org.springframework.web.bind.annotation.RequestParam(required = false) String animalType) {
        return ResponseEntity.ok(diseaseService.getAllDiseases(animalType));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiseaseResponseDTO> getDiseaseById(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return ResponseEntity.ok(diseaseService.getDiseaseById(id));
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<DiseaseResponseDTO> createDisease(@jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.pashucare.backend.dto.DiseaseRequestDTO requestDTO) {
        return new ResponseEntity<>(diseaseService.createDisease(requestDTO), org.springframework.http.HttpStatus.CREATED);
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<DiseaseResponseDTO> updateDisease(@org.springframework.web.bind.annotation.PathVariable Long id, @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.pashucare.backend.dto.DiseaseRequestDTO requestDTO) {
        return ResponseEntity.ok(diseaseService.updateDisease(id, requestDTO));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDisease(@org.springframework.web.bind.annotation.PathVariable Long id) {
        diseaseService.deleteDisease(id);
        return ResponseEntity.noContent().build();
    }
}
