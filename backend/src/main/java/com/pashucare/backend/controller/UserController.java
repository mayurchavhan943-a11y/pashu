package com.pashucare.backend.controller;
import com.pashucare.backend.dto.UserResponseDTO;
import com.pashucare.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        com.pashucare.backend.entity.User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null || (!currentUser.getRole().name().equals("ADMIN") && !currentUser.getId().equals(id))) {
            throw new org.springframework.security.access.AccessDeniedException("Access denied.");
        }
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        com.pashucare.backend.entity.User currentUser = com.pashucare.backend.security.SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new org.springframework.security.access.AccessDeniedException("Not authenticated");
        }
        return ResponseEntity.ok(userService.getUserById(currentUser.getId()));
    }
}
