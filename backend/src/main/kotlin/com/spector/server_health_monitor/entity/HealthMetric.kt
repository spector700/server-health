package com.spector.server_health_monitor.entity

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "metrics")
class HealthMetric(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: UUID = UUID.randomUUID(),

    @Column(name = "server_id", nullable = false)
    val serverId: UUID,

    // Up or Down
    @Column(nullable = false)
    val status: String,

    @Column(name = "response_time_ms")
    val responseTimeMs: Long? = null, // How long the check took

    @Column(nullable = false)
    val timestamp: LocalDateTime = LocalDateTime.now(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "server_id", insertable = false, updatable = false)
    val server: Server? = null
)