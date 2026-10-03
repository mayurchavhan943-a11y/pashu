package com.pashucare.backend.controller;
import com.pashucare.backend.dto.DiagnosisRequestDTO;
import com.pashucare.backend.dto.DiagnosisResponseDTO;
import com.pashucare.backend.service.DiagnosisService;
import com.pashucare.backend.repository.HealthRecordRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/diagnoses")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;
    private final HealthRecordRepository healthRecordRepository;

    public DiagnosisController(DiagnosisService diagnosisService,
         HealthRecordRepository healthRecordRepository) {
        this.diagnosisService = diagnosisService;
        this.healthRecordRepository = healthRecordRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiagnosisResponseDTO> getDiagnosisById(@PathVariable Long id) {
        return ResponseEntity.ok(diagnosisService.getDiagnosisById(id));
    }

    @GetMapping("/health-record/{healthRecordId}")
    public ResponseEntity<DiagnosisResponseDTO> 
    getDiagnosisByHealthRecordId(@PathVariable Long healthRecordId) 
    {
        return ResponseEntity.ok(diagnosisService.getDiagnosisByHealthRecordId(healthRecordId));
    }

    @PostMapping
    public ResponseEntity<DiagnosisResponseDTO>
    createDiagnosis(@Valid @RequestBody DiagnosisRequestDTO requestDTO) 
    {
        return new ResponseEntity<>(diagnosisService.createDiagnosis(requestDTO, healthRecordRepository), 
        HttpStatus.CREATED);
    }
}
