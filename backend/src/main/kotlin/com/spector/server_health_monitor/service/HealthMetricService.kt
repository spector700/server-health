package com.spector.server_health_monitor.service

import com.spector.server_health_monitor.entity.HealthMetric
import com.spector.server_health_monitor.entity.Server
import com.spector.server_health_monitor.repository.HealthMetricRepository
import com.spector.server_health_monitor.repository.ServerRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.net.InetAddress
import java.net.InetSocketAddress
import java.net.Socket
import java.time.LocalDateTime
import java.util.*

@Service
class HealthMetricService(
    private val serverRepository: ServerRepository,
    private val healthMetricRepository: HealthMetricRepository
) {
    // Helper function to check port
    fun checkPort(ip: String, port: Int? = 8080): Boolean {
        return try {
            Socket().use { socket ->
                socket.connect(InetSocketAddress(ip, port!!))
                true
            }
        } catch (e: Exception) {
            println("Error checking port for ${ip}:${port}: ${e.message}")
            false
        }
    }

    // Helper function to check Ping
    fun checkPing(ip: String): Boolean {
        return try {
            val address = InetAddress.getByName(ip)
            address.isReachable(3000)
        } catch (e: Exception) {
            println("Error pinging for ${ip}: ${e.message}")
            false
        }
    }

    // Check a single server with the checkType
    fun checkServer(server: Server): HealthMetric {
        val startTime = System.currentTimeMillis()
        val isUp = try {
            when (server.checkType) {
                "ping" -> checkPing(server.ipAddress)
                "port" -> checkPort(server.ipAddress, server.port)
                // Default to ping
                else -> checkPing(server.ipAddress)
            }
        } catch (e: Exception) {
            println("Error checking server ${server.ipAddress}: ${e.message}")
            false
        }
        val status = if (isUp) "UP" else "DOWN"

        return HealthMetric(
            serverId = server.id,
            status = status,
            responseTime = System.currentTimeMillis() - startTime,
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
            println("Checked ${server.name}: (${server.checkType}): ${result.status}")
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