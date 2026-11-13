
package com.HopnGo.controller;

import com.HopnGo.entity.LocationEntity;
import com.HopnGo.service.LocationService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    // Create location
    @PostMapping
    public LocationEntity createLocation(
            @RequestBody LocationEntity location) {

        return locationService.createLocation(location);
    }

    // Get location by ID
    @GetMapping("/{locationId}")
    public LocationEntity getLocation(
            @PathVariable Long locationId) {

        return locationService.getLocation(locationId);
    }

    // Get all locations
    @GetMapping
    public List<LocationEntity> getAllLocations() {
        return locationService.getAllLocations();
    }
}
