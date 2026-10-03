package com.pashucare.backend.service;

import com.pashucare.backend.dto.VeterinarianResponseDTO;
import com.pashucare.backend.entity.Veterinarian;
import com.pashucare.backend.repository.VeterinarianRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VeterinarianService {

    private final VeterinarianRepository veterinarianRepository;

    public VeterinarianService(VeterinarianRepository veterinarianRepository) {
        this.veterinarianRepository = veterinarianRepository;
    }

    public List<VeterinarianResponseDTO> getAllVeterinarians() {
        return veterinarianRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public VeterinarianResponseDTO getVeterinarianById(Long id) {
        Veterinarian vet = veterinarianRepository.findById(id)
                .orElseThrow(() -> new com.pashucare.backend.exception.ResourceNotFoundException("Veterinarian not found with id: " + id));
        return mapToDTO(vet);
    }

    public VeterinarianResponseDTO createVeterinarian(com.pashucare.backend.dto.VeterinarianRequestDTO requestDTO) {
        checkAdmin();
        Veterinarian vet = new Veterinarian();
        updateEntityFromDTO(vet, requestDTO);
        return mapToDTO(veterinarianRepository.save(vet));
    }

    public VeterinarianResponseDTO updateVeterinarian(Long id, com.pashucare.backend.dto.VeterinarianRequestDTO requestDTO) {
        checkAdmin();
        Veterinarian vet = veterinarianRepository.findById(id)
                .orElseThrow(() -> new com.pashucare.backend.exception.ResourceNotFoundException("Veterinarian not found with id: " + id));
        updateEntityFromDTO(vet, requestDTO);
        return mapToDTO(veterinarianRepository.save(vet));
    }

    public void deleteVeterinarian(Long id) {
        checkAdmin();
        Veterinarian vet = veterinarianRepository.findById(id)
                .orElseThrow(() -> new com.pashucare.backend.exception.ResourceNotFoundException("Veterinarian not found with id: " + id));
        veterinarianRepository.delete(vet);
    }

    private void updateEntityFromDTO(Veterinarian vet, com.pashucare.backend.dto.VeterinarianRequestDTO requestDTO) {
        vet.setName(requestDTO.getName());
        vet.setPhone(requestDTO.getPhone());
        vet.setEmail(requestDTO.getEmail());
        vet.setSpecialization(requestDTO.getSpecialization());
        vet.setClinicName(requestDTO.getClinicName());
        vet.setAddress(requestDTO.getAddress());
        vet.setState(requestDTO.getState());
        vet.setDistrict(requestDTO.getDistrict());
        vet.setLatitude(requestDTO.getLatitude());
        vet.setLongitude(requestDTO.getLongitude());
        vet.setAvailability(requestDTO.getAvailability());
    }

    private void checkAdmin() {
        com.pashucare.backend.entity.User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null || !currentUser.getRole().name().equals("ADMIN")) {
            throw new org.springframework.security.access.AccessDeniedException("Only admins can modify veterinarians.");
        }
    }

    private VeterinarianResponseDTO mapToDTO(Veterinarian veterinarian) {
        VeterinarianResponseDTO dto = new VeterinarianResponseDTO();
        dto.setId(veterinarian.getId());
        dto.setName(veterinarian.getName());
        dto.setPhone(veterinarian.getPhone());
        dto.setEmail(veterinarian.getEmail());
        dto.setSpecialization(veterinarian.getSpecialization());
        dto.setClinicName(veterinarian.getClinicName());
        dto.setAddress(veterinarian.getAddress());
        dto.setState(veterinarian.getState());
        dto.setDistrict(veterinarian.getDistrict());
        dto.setLatitude(veterinarian.getLatitude());
        dto.setLongitude(veterinarian.getLongitude());
        dto.setAvailability(veterinarian.getAvailability());
        return dto;
    }
}
