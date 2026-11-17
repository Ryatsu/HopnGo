
package com.HopnGo.service;

import com.HopnGo.entity.PassengerEntity;
import com.HopnGo.repository.PassengerRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PassengerService {

    private final PassengerRepository passengerRepository;

    public PassengerService(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    // Create a passenger
    public PassengerEntity createPassenger(PassengerEntity passenger) {
        return passengerRepository.save(passenger);
    }

    // Get passenger by ID
    @Transactional(readOnly = true)
    public PassengerEntity getPassenger(Long passengerId) {
        return passengerRepository.findById(passengerId)
                .orElseThrow(() ->
                        new RuntimeException("Passenger not found"));
    }

    // Get all passengers
    @Transactional(readOnly = true)
    public List<PassengerEntity> getAllPassengers() {
        return passengerRepository.findAll();
    }

    // Update passenger profile
    public PassengerEntity updatePassenger(
            Long passengerId,
            PassengerEntity updatedPassenger) {

        PassengerEntity passenger = getPassenger(passengerId);

        passenger.setName(updatedPassenger.getName());
        passenger.setPhone(updatedPassenger.getPhone());
        passenger.setEmail(updatedPassenger.getEmail());

        return passengerRepository.save(passenger);
    }
}
