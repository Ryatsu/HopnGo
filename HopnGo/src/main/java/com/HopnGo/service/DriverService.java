
package com.HopnGo.service;

import com.HopnGo.entity.DriverEntity;
import com.HopnGo.repository.DriverRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    // Create a driver
    public DriverEntity createDriver(DriverEntity driver) {
        return driverRepository.save(driver);
    }

    // Get driver by ID
    @Transactional(readOnly = true)
    public DriverEntity getDriver(Long driverId) {
        return driverRepository.findById(driverId)
                .orElseThrow(() ->
                        new RuntimeException("Driver not found"));
    }

    // Get all drivers
    @Transactional(readOnly = true)
    public List<DriverEntity> getAllDrivers() {
        return driverRepository.findAll();
    }

    // Get available drivers
    @Transactional(readOnly = true)
    public List<DriverEntity> getAvailableDrivers() {
        return driverRepository.findByAvailableTrue();
    }
}
