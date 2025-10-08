package com.spector.server_health_monitor.repository

import com.spector.server_health_monitor.entity.HealthMetric
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*


@Repository
interface HealthMetricRepository : JpaRepository<HealthMetric, UUID> {

    // Get all checks for a server
    fun findByServerIdOrderByTimestampDesc(serverId: UUID): List<HealthMetric>

    // Get checks within a time range
    fun findByServerIdAndTimestampBetweenOrderByTimestamp(
        serverId: UUID,
        start: LocalDateTime,
        end: LocalDateTime
    ): List<HealthMetric>

    // Get latest check for a server
    fun findFirstByServerIdOrderByTimestampDesc(serverId: UUID): HealthMetric?

    // Calculate uptime percentage (custom query)
    @Query(
        value = """
        SELECT 
            CASE 
                WHEN COUNT(*) = 0 THEN 0.0
                ELSE CAST(SUM(CASE WHEN status = 'up' THEN 1 ELSE 0 END) AS DOUBLE PRECISION) * 100.0 / COUNT(*)
            END
        FROM  metrics
        WHERE server_id = :serverId
    """,
        nativeQuery = true
    )
    fun calculateUptimePercentage(serverId: UUID): Double?
}
