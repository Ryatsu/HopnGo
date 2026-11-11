
package com.HopnGo.controller;

import com.HopnGo.entity.RideEntity;
import com.HopnGo.service.RideService;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "*")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    // Book a ride
    @PostMapping("/book")
    public RideEntity bookRide(
            @RequestParam Long passengerId,
            @RequestParam Long pickupLocationId,
            @RequestParam Long destinationLocationId) {

        return rideService.bookRide(
                passengerId,
                pickupLocationId,
                destinationLocationId
        );
    }

    // Assign a driver
    @PutMapping("/{rideId}/assign/{driverId}")
    public RideEntity assignDriver(
            @PathVariable Long rideId,
            @PathVariable Long driverId) {

        return rideService.assignDriver(rideId, driverId);
    }

    // Cancel a ride
    @PutMapping("/{rideId}/cancel")
    public RideEntity cancelRide(@PathVariable Long rideId) {
        return rideService.cancelRide(rideId);
    }

    // Start a trip
    @PutMapping("/{rideId}/start")
    public RideEntity startTrip(@PathVariable Long rideId) {
        return rideService.startTrip(rideId);
    }

    // Complete a trip
    @PutMapping("/{rideId}/complete")
    public RideEntity completeTrip(
            @PathVariable Long rideId,
            @RequestParam BigDecimal fare) {

        return rideService.completeTrip(rideId, fare);
    }

    // Get all rides
    @GetMapping
    public List<RideEntity> getAllRides() {
        return rideService.getAllRides();
    }

    // Get passenger rides
    @GetMapping("/passenger/{passengerId}")
    public List<RideEntity> getPassengerRides(
            @PathVariable Long passengerId) {

        return rideService.getPassengerRides(passengerId);
    }

    // Get driver rides
    @GetMapping("/driver/{driverId}")
    public List<RideEntity> getDriverRides(
            @PathVariable Long driverId) {

        return rideService.getDriverRides(driverId);
    }
}
