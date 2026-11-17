package com.travelguardian.disruption.entity;

import com.travelguardian.flight.entity.Flight;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "disruptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disruption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "flight_id", nullable = false)
    private Flight flight;

    @Enumerated(EnumType.STRING)
    private DisruptionType type;

    @Enumerated(EnumType.STRING)
    private DisruptionSeverity severity;

    @Column(columnDefinition = "TEXT")
    private String description;

    private boolean resolved;

    @CreationTimestamp
    private LocalDateTime detectedAt;
}