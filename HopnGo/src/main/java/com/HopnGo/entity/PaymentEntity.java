package com.HopnGo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private String method;

    private String status;

    private LocalDateTime paymentDate;

    protected PaymentEntity() {
    }

    public PaymentEntity(BigDecimal amount, String method, String status) {
        this.amount = amount;
        this.method = method;
        this.status = status;
        this.paymentDate = LocalDateTime.now();
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    // Actual payment processing will be implemented in PaymentService.
    public boolean processPayment() {
        return false;
    }

    // Actual refund processing will be implemented in PaymentService.
    public boolean refund() {
        return false;
    }

    public String getPaymentStatus() {
        return status;
    }
}