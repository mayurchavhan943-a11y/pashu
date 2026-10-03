package com.pashucare.backend.controller;
import com.pashucare.backend.dto.HealthRecordRequestDTO;
import com.pashucare.backend.dto.HealthRecordResponseDTO;
import com.pashucare.backend.service.HealthRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/health-records")
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    public HealthRecordController(HealthRecordService healthRecordService) {
        this.healthRecordService = healthRecordService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthRecordResponseDTO> getHealthRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(healthRecordService.getHealthRecordById(id));
    }

    @GetMapping("/animal/{animalId}")
    public ResponseEntity<java.util.List<HealthRecordResponseDTO>> 
    getHealthRecordsByAnimalId(@PathVariable Long animalId) {
        return ResponseEntity.ok(healthRecordService.getHealthRecordsByAnimalId(animalId));
    }

    @PostMapping
    public ResponseEntity<HealthRecordResponseDTO> 
    createHealthRecord(@Valid @RequestBody HealthRecordRequestDTO requestDTO) {
        return new ResponseEntity<>(healthRecordService.createHealthRecord(requestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthRecordResponseDTO> updateHealthRecord(@PathVariable Long id, 
        @Valid @RequestBody HealthRecordRequestDTO requestDTO) {
        return ResponseEntity.ok(healthRecordService.updateHealthRecord(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthRecord(@PathVariable Long id) {
        healthRecordService.deleteHealthRecord(id);
        return ResponseEntity.noContent().build();
    }
}
