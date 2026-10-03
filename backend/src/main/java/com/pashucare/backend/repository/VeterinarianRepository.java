package com.pashucare.backend.repository;

import com.pashucare.backend.entity.Veterinarian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VeterinarianRepository extends JpaRepository<Veterinarian, Long> {
    List<Veterinarian> findByStateAndDistrict(String state, String district);
}
