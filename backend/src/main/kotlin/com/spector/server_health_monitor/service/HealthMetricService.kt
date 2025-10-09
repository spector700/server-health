package com.spector.server_health_monitor.service

import com.spector.server_health_monitor.entity.HealthMetric
import com.spector.server_health_monitor.entity.Server
import com.spector.server_health_monitor.repository.HealthMetricRepository
import com.spector.server_health_monitor.repository.ServerRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.net.InetSocketAddress
import java.net.Socket
import java.time.LocalDateTime
import java.util.*

@Service
class HealthMetricService(
    private val serverRepository: ServerRepository,
    private val healthMetricRepository: HealthMetricRepository
) {
    // Try to connect to server
    fun pingServer(ip: String, port: Int): Boolean {
        return try {
            Socket().use { socket ->
                socket.connect(InetSocketAddress(ip, port))
                true
            }
        } catch (e: Exception) {
            println(e.message)
            false
        }
    }

    // Check a single server
    fun checkServer(server: Server): HealthMetric {
        val startTime = System.currentTimeMillis()
        val isUp = try {
            pingServer(server.ipAddress, server.port)
        } catch (e: Exception) {
            println("Error pinging server ${server.ipAddress}: ${e.message}")
            false
        }
        val status = if (isUp) "UP" else "DOWN"

        val responseTime = System.currentTimeMillis() - startTime
        return HealthMetric(
            serverId = server.id,
            status = status,
            responseTimeMs = responseTime,
            timestamp = LocalDateTime.now(),
        )
    }

    // Run every 5 minutes
    @Scheduled(fixedRate = 300000)
    fun checkAllServersUptime() {
        println("Running checking for servers: ${LocalDateTime.now()}")
        val servers = serverRepository.findAll()

        servers.forEach { server ->
            val result = checkServer(server)
            healthMetricRepository.save(result)
            println("Checked ${server.name}: ${result.status}")
        }
    }

    // Get health check history for a server
    fun getServerHistory(serverId: UUID, hours: Int = 24): List<HealthMetric> {
        val start = LocalDateTime.now().minusHours(hours.toLong())
        val end = LocalDateTime.now()
        return healthMetricRepository.findByServerIdAndTimestampBetweenOrderByTimestamp(
            serverId, start, end
        )
    }

    fun getUptimePercentage(serverId: UUID): Double {
        return healthMetricRepository.calculateUptimePercentage(serverId) ?: 0.0
    }

    fun getLatestStatus(serverId: UUID): HealthMetric? {
        return healthMetricRepository.findFirstByServerIdOrderByTimestampDesc(serverId)
    }

    // Manual trigger (for testing)
    fun checkServerNow(serverId: UUID): HealthMetric {
        val server = serverRepository.findById(serverId)
            .orElseThrow { IllegalArgumentException("Server not found") }
        val result = checkServer(server)
        return healthMetricRepository.save(result)
    }

}