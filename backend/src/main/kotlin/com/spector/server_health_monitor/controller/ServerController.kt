package com.spector.server_health_monitor.controller

import com.spector.server_health_monitor.entity.Server
import com.spector.server_health_monitor.service.ServerService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/api/servers")
class ServerController(val serverService: ServerService) {
    data class ServerRequest(
        val name: String,
        val hostname: String?,
        val checkType: String = "ping",
        val ipAddress: String,
        val port: Int,
        val location: String? = null
    )

    @PostMapping
    fun create(@RequestBody request: ServerRequest): Server {
        return serverService.createServer(
            request.name,
            request.hostname,
            request.ipAddress,
            request.checkType,
            request.port,
            request.location
        )
    }

    @PutMapping("/{id}")
    fun updateServer(
        @PathVariable id: UUID,
        @RequestBody request: ServerRequest
    ): ResponseEntity<Server> {
        return try {
            val updatedServer = serverService.updateServer(
                id = id,
                name = request.name,
                hostname = request.hostname,
                checkType = request.checkType,
                ipAddress = request.ipAddress,
                port = request.port,
                location = request.location
            )
            ResponseEntity.ok(updatedServer)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping
    fun getAllServers(): List<Server> {
        return serverService.getAllServers()
    }

    @GetMapping("/{id}")
    fun getServerById(@PathVariable id: UUID): Server? {
        return serverService.getServerById(id)
    }

    @DeleteMapping("/{id}")
    fun deleteServerById(@PathVariable id: UUID): Server? {
        return serverService.deleteServerById(id)
    }
}