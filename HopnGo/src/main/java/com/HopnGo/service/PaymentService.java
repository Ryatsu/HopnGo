
package com.HopnGo.service;

import com.HopnGo.entity.PaymentEntity;
import com.HopnGo.entity.RideEntity;
import com.HopnGo.repository.PaymentRepository;
import com.HopnGo.repository.RideRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RideRepository rideRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            RideRepository rideRepository) {

        this.paymentRepository = paymentRepository;
        this.rideRepository = rideRepository;
    }

    // Create a payment record for a completed ride
    public PaymentEntity processPayment(Long rideId, String method) {

        RideEntity ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        if (!"COMPLETED".equals(ride.getStatus())) {
            throw new RuntimeException("Ride must be completed before payment");
        }

        if (ride.getFare() == null || ride.getFare().signum() <= 0) {
            throw new RuntimeException("Invalid ride fare");
        }

        if (ride.getPayment() != null) {
            throw new RuntimeException("Payment already exists for this ride");
        }

        if (method == null || method.isBlank()) {
            throw new RuntimeException("Payment method is required");
        }

        // PENDING means payment has not yet been confirmed
        PaymentEntity payment = new PaymentEntity(
                ride.getFare(),
                method,
                "PENDING"
        );

        PaymentEntity savedPayment = paymentRepository.save(payment);

        ride.setPayment(savedPayment);
        rideRepository.save(ride);

        return savedPayment;
    }
}
