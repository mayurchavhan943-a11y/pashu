package com.pashucare.backend.controller;
import com.pashucare.backend.dto.VeterinarianResponseDTO;
import com.pashucare.backend.service.VeterinarianService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/veterinarians")
public class VeterinarianController {

    private final VeterinarianService veterinarianService;

    public VeterinarianController(VeterinarianService veterinarianService) {
        this.veterinarianService = veterinarianService;
    }

    @GetMapping
    public ResponseEntity<List<VeterinarianResponseDTO>> getAllVeterinarians() {
        return ResponseEntity.ok(veterinarianService.getAllVeterinarians());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VeterinarianResponseDTO> getVeterinarianById(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return ResponseEntity.ok(veterinarianService.getVeterinarianById(id));
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<VeterinarianResponseDTO> createVeterinarian(@jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.pashucare.backend.dto.VeterinarianRequestDTO requestDTO) {
        return new ResponseEntity<>(veterinarianService.createVeterinarian(requestDTO), org.springframework.http.HttpStatus.CREATED);
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public ResponseEntity<VeterinarianResponseDTO> updateVeterinarian(@org.springframework.web.bind.annotation.PathVariable Long id, @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.pashucare.backend.dto.VeterinarianRequestDTO requestDTO) {
        return ResponseEntity.ok(veterinarianService.updateVeterinarian(id, requestDTO));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVeterinarian(@org.springframework.web.bind.annotation.PathVariable Long id) {
        veterinarianService.deleteVeterinarian(id);
        return ResponseEntity.noContent().build();
    }
}
