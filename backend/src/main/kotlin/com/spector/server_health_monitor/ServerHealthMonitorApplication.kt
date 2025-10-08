package com.spector.server_health_monitor

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class ServerHealthMonitorApplication

fun main(args: Array<String>) {
    runApplication<ServerHealthMonitorApplication>(*args)
}
