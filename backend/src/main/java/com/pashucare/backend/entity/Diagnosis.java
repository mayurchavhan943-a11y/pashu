package com.pashucare.backend.entity;

import com.pashucare.backend.entity.enums.Severity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "diagnoses")
public class Diagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "health_record_id", nullable = false, unique = true)
    private HealthRecord healthRecord;

    @Column(nullable = false)
    private String suspectedDisease;

    private Double confidence;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Severity severity;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(columnDefinition = "TEXT")
    private String warning;

    private Boolean veterinaryAttentionRecommended;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public Diagnosis() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public HealthRecord getHealthRecord() { return healthRecord; }
    public void setHealthRecord(HealthRecord healthRecord) { this.healthRecord = healthRecord; }
    public String getSuspectedDisease() { return suspectedDisease; }
    public void setSuspectedDisease(String suspectedDisease) { this.suspectedDisease = suspectedDisease; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public String getWarning() { return warning; }
    public void setWarning(String warning) { this.warning = warning; }
    public Boolean getVeterinaryAttentionRecommended() { return veterinaryAttentionRecommended; }
    public void setVeterinaryAttentionRecommended(Boolean veterinaryAttentionRecommended) { this.veterinaryAttentionRecommended = veterinaryAttentionRecommended; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
