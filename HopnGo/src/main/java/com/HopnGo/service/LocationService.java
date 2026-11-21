
package com.HopnGo.service;

import com.HopnGo.entity.LocationEntity;
import com.HopnGo.repository.LocationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    // Create location
    public LocationEntity createLocation(LocationEntity location) {
        return locationRepository.save(location);
    }

    // Get location by ID
    @Transactional(readOnly = true)
    public LocationEntity getLocation(Long locationId) {
        return locationRepository.findById(locationId)
                .orElseThrow(() ->
                        new RuntimeException("Location not found"));
    }

    // Get all locations
    @Transactional(readOnly = true)
    public List<LocationEntity> getAllLocations() {
        return locationRepository.findAll();
    }
}
