package com.spector.server_health_monitor.controller

import com.spector.server_health_monitor.entity.Server
import com.spector.server_health_monitor.service.ServerService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/servers")
class ServerController(val serverService: ServerService) {
    data class CreateServerRequest(
        val name: String,
        val hostname: String,
        val ipAddress: String? = null,
        val port: Int,
        val location: String? = null)

        @PostMapping
    fun create(@RequestBody request: CreateServerRequest): Server {
        return serverService.createServer(request.name, request.hostname, request.ipAddress, request.port, request.location)
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