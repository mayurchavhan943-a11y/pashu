package com.pashucare.backend.service;

import com.pashucare.backend.dto.AIRequestDTO;
import com.pashucare.backend.dto.AIResponseDTO;
import com.pashucare.backend.exception.AIServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class AIServiceClient {

    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public AIServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public AIResponseDTO getPrediction(AIRequestDTO requestDTO) {
        String endpoint = aiServiceUrl + "/api/v1/predict";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AIRequestDTO> request = new HttpEntity<>(requestDTO, headers);

        try {
            ResponseEntity<AIResponseDTO> response = restTemplate.postForEntity(endpoint, request, AIResponseDTO.class);
            return response.getBody();
        } catch (RestClientException e) {
            throw new AIServiceException("AI Service is currently unavailable or returned an error: " + e.getMessage(), e);
        }
    }
}
