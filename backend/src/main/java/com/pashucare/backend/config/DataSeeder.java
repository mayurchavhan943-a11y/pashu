package com.pashucare.backend.config;

import com.pashucare.backend.entity.Animal;
import com.pashucare.backend.entity.User;
import com.pashucare.backend.entity.Veterinarian;
import com.pashucare.backend.entity.enums.UserRole;
import com.pashucare.backend.repository.AnimalRepository;
import com.pashucare.backend.repository.UserRepository;
import com.pashucare.backend.repository.VeterinarianRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, AnimalRepository animalRepository, VeterinarianRepository veterinarianRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User farmer = new User();
                farmer.setName("Ramesh Kumar");
                farmer.setEmail("ramesh@example.com");
                farmer.setPhone("9876543210");
                farmer.setPassword("hashedpassword123"); // Placeholder for now
                farmer.setRole(UserRole.FARMER);
                farmer.setState("Maharashtra");
                farmer.setDistrict("Pune");
                userRepository.save(farmer);

                Animal cow = new Animal();
                cow.setUser(farmer);
                cow.setAnimalType("Cow");
                cow.setBreed("Gir");
                cow.setNameOrTag("Gauri-101");
                cow.setAge(4);
                cow.setGender("Female");
                cow.setWeight(450.0);
                animalRepository.save(cow);
                
                Animal goat = new Animal();
                goat.setUser(farmer);
                goat.setAnimalType("Goat");
                goat.setBreed("Boer");
                goat.setNameOrTag("Tag-220");
                goat.setAge(2);
                goat.setGender("Male");
                goat.setWeight(40.0);
                animalRepository.save(goat);
            }
            
            if (veterinarianRepository.count() == 0) {
                Veterinarian vet = new Veterinarian();
                vet.setName("Dr. Anita Sharma");
                vet.setEmail("anita.vet@example.com");
                vet.setPhone("9123456780");
                vet.setSpecialization("Livestock & Poultry");
                vet.setClinicName("PashuCare Clinic Pune");
                vet.setState("Maharashtra");
                vet.setDistrict("Pune");
                veterinarianRepository.save(vet);
            }
        };
    }
}
