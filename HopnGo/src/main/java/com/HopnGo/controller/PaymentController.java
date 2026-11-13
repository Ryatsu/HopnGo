
package com.HopnGo.controller;

import com.HopnGo.entity.PaymentEntity;
import com.HopnGo.service.PaymentService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create a pending payment
    @PostMapping("/process/{rideId}")
    public PaymentEntity processPayment(
            @PathVariable Long rideId,
            @RequestParam String method) {

        return paymentService.processPayment(rideId, method);
    }

    // Confirm a payment
    @PutMapping("/{paymentId}/confirm")
    public PaymentEntity confirmPayment(
            @PathVariable Long paymentId) {

        return paymentService.confirmPayment(paymentId);
    }

    // Refund a payment
    @PutMapping("/{paymentId}/refund")
    public PaymentEntity refundPayment(
            @PathVariable Long paymentId) {

        return paymentService.refundPayment(paymentId);
    }
}
