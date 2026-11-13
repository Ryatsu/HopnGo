package com.HopnGo.controller;

import com.HopnGo.entity.PassengerEntity;
import com.HopnGo.service.PassengerService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin(origins = "*")
public class PassengerController {

    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    // Create passenger
    @PostMapping
    public PassengerEntity createPassenger(
            @RequestBody PassengerEntity passenger) {

        return passengerService.createPassenger(passenger);
    }

    // Get passenger by ID
    @GetMapping("/{passengerId}")
    public PassengerEntity getPassenger(
            @PathVariable Long passengerId) {

        return passengerService.getPassenger(passengerId);
    }

    // Get all passengers
    @GetMapping
    public List<PassengerEntity> getAllPassengers() {
        return passengerService.getAllPassengers();
    }
}