package com.HopnGo.service;

import com.HopnGo.entity.PaymentEntity;
import com.HopnGo.entity.RideEntity;
import com.HopnGo.repository.PaymentRepository;
import com.HopnGo.repository.RideRepository;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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

        if (!RideEntity.COMPLETED.equals(ride.getStatus())) {
            throw new IllegalStateException(
                    "Ride must be completed before payment"
            );
        }

        if (ride.getFare() == null ||
                ride.getFare().signum() <= 0) {
            throw new IllegalArgumentException("Invalid ride fare");
        }

        if (ride.getPayment() != null) {
            throw new IllegalStateException(
                    "Payment already exists for this ride"
            );
        }

        PaymentEntity payment = new PaymentEntity(
                ride.getFare(),
                method,
                PaymentEntity.PENDING
        );

        PaymentEntity savedPayment = paymentRepository.save(payment);

        ride.setPayment(savedPayment);
        rideRepository.save(ride);

        return savedPayment;
    }

    // Confirm a pending payment
    public PaymentEntity confirmPayment(Long paymentId) {

        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        payment.markAsPaid();

        return paymentRepository.save(payment);
    }

    // Refund a paid payment
    public PaymentEntity refundPayment(Long paymentId) {

        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException("Payment not found"));

        payment.markAsRefunded();

        return paymentRepository.save(payment);
    }

    // View all payment records
    @Transactional(readOnly = true)
    public java.util.List<PaymentEntity> getAllPayments() {
        return paymentRepository.findAll();
    }

    // Get payment history for a specific passenger
    @Transactional(readOnly = true)
    public List<PaymentEntity> getPaymentsByPassenger(Long passengerId) {

        return rideRepository.findByPassenger_UserId(passengerId)
                .stream()
                .map(RideEntity::getPayment)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}
