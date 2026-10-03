package com.pashucare.backend.repository;

import com.pashucare.backend.entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Long> {
    List<Disease> findByAnimalType(String animalType);
    List<Disease> findByAnimalTypeIgnoreCase(String animalType);
}
