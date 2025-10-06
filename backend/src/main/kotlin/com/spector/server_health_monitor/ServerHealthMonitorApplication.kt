package com.spector.server_health_monitor

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ServerHealthMonitorApplication

fun main(args: Array<String>) {
	runApplication<ServerHealthMonitorApplication>(*args)
}
