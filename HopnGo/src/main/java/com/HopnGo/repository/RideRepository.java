
package com.HopnGo.repository;

import com.HopnGo.entity.RideEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RideRepository extends JpaRepository<RideEntity, Long> {

    // Fetch ride relationships when finding one ride
    @Override
    @EntityGraph(attributePaths = {
        "passenger",
        "driver",
        "pickupLocation",
        "destinationLocation",
        "payment"
    })
    Optional<RideEntity> findById(Long rideId);

    // Fetch relationships when finding all rides
    @Override
    @EntityGraph(attributePaths = {
        "passenger",
        "driver",
        "pickupLocation",
        "destinationLocation",
        "payment"
    })
    List<RideEntity> findAll();

    // Fetch relationships when finding passenger rides
    @EntityGraph(attributePaths = {
        "passenger",
        "driver",
        "pickupLocation",
        "destinationLocation",
        "payment"
    })
    List<RideEntity> findByPassenger_UserId(Long userId);

    // Fetch relationships when finding driver rides
    @EntityGraph(attributePaths = {
        "passenger",
        "driver",
        "pickupLocation",
        "destinationLocation",
        "payment"
    })
    List<RideEntity> findByDriver_UserId(Long userId);

    // Fetch all ride requests that are still waiting for a driver
    @EntityGraph(attributePaths = {
        "passenger",
        "driver",
        "pickupLocation",
        "destinationLocation",
        "payment"
    })
    List<RideEntity> findByStatus(String status);
}
