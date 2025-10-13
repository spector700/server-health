package com.spector.server_health_monitor.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "server_metrics")
class HealthMetric(
    @Id
    val id: UUID = UUID.randomUUID(),

    // The server id associated with this metric
    @Column(name = "server_id", nullable = false)
    val serverId: UUID,

    // Up or Down
    @Column(nullable = false)
    val status: String,

    @Column(name = "response_time")
    val responseTime: Long? = null,

    @Column(nullable = false)
    val timestamp: LocalDateTime = LocalDateTime.now(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "server_id", insertable = false, updatable = false)
    @JsonIgnore
    //TODO fix the serialization by maybe doing a Data Transfer Object
//    data class HealthMetricDTO(
//        val id: UUID,
//        val cpuUsage: Double,
//        val memoryUsage: Double,
//        val serverId: UUID
//    )
    val server: Server? = null
)