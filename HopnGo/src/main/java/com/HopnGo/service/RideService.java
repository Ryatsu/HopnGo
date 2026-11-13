
package com.HopnGo.service;

import com.HopnGo.entity.*;
import com.HopnGo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class RideService {

    private final RideRepository rideRepository;
    private final PassengerRepository passengerRepository;
    private final DriverRepository driverRepository;
    private final LocationRepository locationRepository;

    public RideService(
            RideRepository rideRepository,
            PassengerRepository passengerRepository,
            DriverRepository driverRepository,
            LocationRepository locationRepository) {

        this.rideRepository = rideRepository;
        this.passengerRepository = passengerRepository;
        this.driverRepository = driverRepository;
        this.locationRepository = locationRepository;
    }

    // 1. Book a ride
    public RideEntity bookRide(
            Long passengerId,
            Long pickupLocationId,
            Long destinationLocationId) {

        PassengerEntity passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        LocationEntity pickup = locationRepository.findById(pickupLocationId)
                .orElseThrow(() -> new RuntimeException("Pickup location not found"));

        LocationEntity destination = locationRepository.findById(destinationLocationId)
                .orElseThrow(() -> new RuntimeException("Destination location not found"));

        RideEntity ride = new RideEntity(passenger, pickup, destination);

        return rideRepository.save(ride);
    }

    // 2. Assign a driver
    public RideEntity assignDriver(Long rideId, Long driverId) {

        RideEntity ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        DriverEntity driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (!RideEntity.REQUESTED.equals(ride.getStatus())) {
            throw new IllegalStateException("Ride is not awaiting a driver");
        }

        driver.acceptRide();

        ride.setDriver(driver);
        ride.updateStatus(RideEntity.ACCEPTED);

        driverRepository.save(driver);

        return rideRepository.save(ride);
    }

    // 3. Cancel a ride
    public RideEntity cancelRide(Long rideId) {

        RideEntity ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (ride.getDriver() != null) {
            ride.getDriver().releaseFromRide();
            driverRepository.save(ride.getDriver());
        }

        ride.cancelRide();

        return rideRepository.save(ride);
    }

    // 4. Start a trip
    public RideEntity startTrip(Long rideId) {

        RideEntity ride = rideRepository.findById(rideId)
            .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        ride.startTrip();

        return rideRepository.save(ride);
    }

    // 5. Complete a trip
    public RideEntity completeTrip(Long rideId, BigDecimal fare) {

        RideEntity ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (fare == null || fare.signum() <= 0) {
            throw new IllegalArgumentException("Invalid ride fare");
        }

        ride.setFare(fare);
        ride.endTrip();

        if (ride.getDriver() != null) {
            ride.getDriver().completeRide();
            driverRepository.save(ride.getDriver());
        }

        return rideRepository.save(ride);
    }

    // 6. View all rides
    @Transactional(readOnly = true)
    public List<RideEntity> getAllRides() {
        return rideRepository.findAll();
    }

    // 7. View rides by passenger
    @Transactional(readOnly = true)
    public List<RideEntity> getPassengerRides(Long passengerId) {
        return rideRepository.findByPassenger_UserId(passengerId);
    }

    // 8. View rides by driver
    @Transactional(readOnly = true)
    public List<RideEntity> getDriverRides(Long driverId) {
        return rideRepository.findByDriver_UserId(driverId);
    }
}
