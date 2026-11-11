
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

    @PostMapping("/process/{rideId}")
    public PaymentEntity processPayment(
            @PathVariable Long rideId,
            @RequestParam String method) {

        return paymentService.processPayment(rideId, method);
    }
}
