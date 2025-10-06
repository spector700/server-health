package com.spector.server_health_monitor.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class HealthControllerRestController {

    @GetMapping("/health")
    fun health(): Map<String, String> {
        return mapOf("status" to "UP")
    }

}
class HealthController {
}