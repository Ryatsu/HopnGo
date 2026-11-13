package com.HopnGo.controller;

import com.HopnGo.entity.DriverEntity;
import com.HopnGo.service.DriverService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // Create driver
    @PostMapping
    public DriverEntity createDriver(
            @RequestBody DriverEntity driver) {

        return driverService.createDriver(driver);
    }

    // Get driver by ID
    @GetMapping("/{driverId}")
    public DriverEntity getDriver(
            @PathVariable Long driverId) {

        return driverService.getDriver(driverId);
    }

    // Get all drivers
    @GetMapping
    public List<DriverEntity> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    // Get available drivers
    @GetMapping("/available")
    public List<DriverEntity> getAvailableDrivers() {
        return driverService.getAvailableDrivers();
    }
}