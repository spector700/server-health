package com.spector.server_health_monitor.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "servers")
class Server(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, unique = true)
    val name: String,

    @Column(nullable = false)
    val hostname: String,

    @Column(name = "ip_address")
    val ipAddress: String? = null,

    val port: Int,

    val location: String? = null
)