package com.pashucare.backend.controller;

import com.pashucare.backend.dto.AIRequestDTO;
import com.pashucare.backend.dto.AIResponseDTO;
import com.pashucare.backend.service.AIServiceClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    private final AIServiceClient aiServiceClient;

    public AIController(AIServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    @PostMapping("/predict")
    public ResponseEntity<AIResponseDTO> getPrediction(@RequestBody AIRequestDTO requestDTO) {
        AIResponseDTO response = aiServiceClient.getPrediction(requestDTO);
        return ResponseEntity.ok(response);
    }
}
