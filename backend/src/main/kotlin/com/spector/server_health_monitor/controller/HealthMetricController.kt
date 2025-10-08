package com.spector.server_health_monitor.controller

import com.spector.server_health_monitor.entity.HealthMetric
import com.spector.server_health_monitor.service.HealthMetricService
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/v1/health-metrics")
class HealthMetricController(private val healthMetricService: HealthMetricService) {
    @GetMapping("/server/{serverId}")
    fun getServerHistory(
        @PathVariable serverId: UUID,
        @RequestParam(defaultValue = "24") hours: Int
    ): List<HealthMetric> {
        return healthMetricService.getServerHistory(serverId, hours)
    }

    // Get latest status for a server
    @GetMapping("/server/{serverId}/latest")
    fun getLatestStatus(@PathVariable serverId: UUID): HealthMetric? {
        return healthMetricService.getLatestStatus(serverId)
    }

    // Get uptime percentage
    @GetMapping("/server/{serverId}/uptime")
    fun getUptime(@PathVariable serverId: UUID): Map<String, Double> {
        val uptime = healthMetricService.getUptimePercentage(serverId)
        return mapOf("uptimePercentage" to uptime)
    }
}