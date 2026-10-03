package com.pashucare.backend;

import com.pashucare.backend.dto.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test") // Uses H2 in-memory DB
public class FlowVerificationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testCompleteBackendFlow() {
        // 1. User Registration
        RegisterRequestDTO registerRequest = new RegisterRequestDTO();
        registerRequest.setName("Test Farmer");
        registerRequest.setEmail("farmer@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setRole("FARMER");

        ResponseEntity<String> registerResponse = restTemplate.postForEntity("/api/v1/auth/register", registerRequest, String.class);
        assertThat(registerResponse.getStatusCode().is2xxSuccessful()).isTrue();

        // 2. User Login
        LoginRequestDTO loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("farmer@example.com");
        loginRequest.setPassword("password123");

        ResponseEntity<AuthResponseDTO> loginResponse = restTemplate.postForEntity("/api/v1/auth/login", loginRequest, AuthResponseDTO.class);
        assertThat(loginResponse.getStatusCode().is2xxSuccessful()).isTrue();
        String token = loginResponse.getBody().getToken();
        assertThat(token).isNotNull();

        Long userId = loginResponse.getBody().getUser().getId();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        // 3. Animal Creation
        AnimalRequestDTO animalRequest = new AnimalRequestDTO();
        animalRequest.setUserId(userId);
        animalRequest.setAnimalType("Cow");
        animalRequest.setBreed("Jersey");
        animalRequest.setNameOrTag("Bessie-99");
        animalRequest.setAge(4);
        animalRequest.setGender("Female");
        animalRequest.setWeight(500.0);
        animalRequest.setLocation("Farm A");

        HttpEntity<AnimalRequestDTO> animalEntity = new HttpEntity<>(animalRequest, headers);
        ResponseEntity<AnimalResponseDTO> animalResponse = restTemplate.exchange("/api/v1/animals", HttpMethod.POST, animalEntity, AnimalResponseDTO.class);
        if (!animalResponse.getStatusCode().is2xxSuccessful()) {
            System.out.println("Error creating animal: " + animalResponse.getStatusCode() + " " + animalResponse.getBody());
        }
        assertThat(animalResponse.getStatusCode().is2xxSuccessful()).isTrue();
        Long animalId = animalResponse.getBody().getId();
        assertThat(animalId).isNotNull();

        // 4. HealthRecord Creation
        HealthRecordRequestDTO hrRequest = new HealthRecordRequestDTO();
        hrRequest.setAnimalId(animalId);
        hrRequest.setTemperature(103.0);
        hrRequest.setSymptoms("Fever, Cough");
        hrRequest.setBehaviour("Lethargic");
        hrRequest.setDuration("3 days");
        hrRequest.setAppetite("Low");
        hrRequest.setWaterIntake("Normal");
        hrRequest.setActivityLevel("Low");

        HttpEntity<HealthRecordRequestDTO> hrEntity = new HttpEntity<>(hrRequest, headers);
        ResponseEntity<HealthRecordResponseDTO> hrResponse = restTemplate.exchange("/api/v1/health-records", HttpMethod.POST, hrEntity, HealthRecordResponseDTO.class);
        assertThat(hrResponse.getStatusCode().is2xxSuccessful()).isTrue();
        Long hrId = hrResponse.getBody().getId();
        assertThat(hrId).isNotNull();

        // 5. & 6. AI Service Call
        AIRequestDTO aiRequest = new AIRequestDTO();
        aiRequest.setAnimalType("Cow");
        aiRequest.setBreed("Jersey");
        aiRequest.setAge(4);
        aiRequest.setGender("Female");
        aiRequest.setSymptoms("Fever, Cough");
        aiRequest.setBehaviourChanges("Lethargic");
        aiRequest.setDuration("3 days");
        aiRequest.setTemperature(103.0);

        HttpEntity<AIRequestDTO> aiEntity = new HttpEntity<>(aiRequest, headers);
        ResponseEntity<AIResponseDTO> aiResponse = restTemplate.exchange("/api/v1/ai/predict", HttpMethod.POST, aiEntity, AIResponseDTO.class);
        
        // This will verify Spring Boot can talk to the FastAPI service running in the background.
        assertThat(aiResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(aiResponse.getBody().getRiskLevel()).isNotNull();
        assertThat(aiResponse.getBody().getPredictedCondition()).isNotNull();
        
        // 10. Verify Error Handling if FastAPI is unavailable
        // We'll skip doing this in the same test because we need to kill FastAPI, but we manually verify the logic.
    }
}
