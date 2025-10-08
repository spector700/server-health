package com.spector.server_health_monitor.repository

import com.spector.server_health_monitor.entity.Server
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ServerRepository : JpaRepository<Server, UUID>