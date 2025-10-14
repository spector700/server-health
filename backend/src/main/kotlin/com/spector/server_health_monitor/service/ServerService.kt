package com.spector.server_health_monitor.service

import com.spector.server_health_monitor.entity.Server
import com.spector.server_health_monitor.repository.ServerRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.util.*

@Service
class ServerService(private val repository: ServerRepository) {

    fun createServer(
        name: String,
        hostname: String? = null,
        checkType: String = "ping",
        ipAddress: String,
        port: Int,
        location: String? = null
    ): Server {
        val server = Server(
            name = name,
            hostname = hostname,
            checkType = checkType,
            ipAddress = ipAddress,
            port = port,
            location = location
        )
        return repository.save(server)
    }

    fun updateServer(
        id: UUID,
        name: String,
        hostname: String? = null,
        checkType: String,
        ipAddress: String,
        port: Int,
        location: String? = null
    ): Server {
        val existingServer =
            repository.findById(id).orElseThrow { IllegalArgumentException("Server with id $id not found") }

        // Create updated server
        val updatedServer = existingServer.copy(
            name = name,
            hostname = hostname,
            ipAddress = ipAddress,
            checkType = checkType,
            port = port,
            location = location
        )
        return repository.save(updatedServer)
    }

    fun getAllServers(): List<Server> {
        return repository.findAll()
    }

    fun getServerById(id: UUID): Server? {
        return repository.findByIdOrNull(id)
    }

    fun deleteServerById(id: UUID): Server? {
        val result = getServerById(id)
        if (result != null) {
            repository.delete(result)
        }
        return null
    }
}