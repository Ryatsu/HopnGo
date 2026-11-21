
package com.HopnGo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class PaymentEntity {

    public static final String PENDING = "PENDING";
    public static final String PAID = "PAID";
    public static final String FAILED = "FAILED";
    public static final String REFUNDED = "REFUNDED";

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
        setAmount(amount);
        setMethod(method);
        setStatus(status);
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
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                "Payment amount must be greater than zero"
            );
        }
        this.amount = amount;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        if (method == null || method.isBlank()) {
            throw new IllegalArgumentException(
                "Payment method cannot be empty"
            );
        }
        this.method = method;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        if (!PENDING.equals(status)
                && !PAID.equals(status)
                && !FAILED.equals(status)
                && !REFUNDED.equals(status)) {
            throw new IllegalArgumentException("Invalid payment status");
        }
        this.status = status;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentStatus() {
        return status;
    }

    public void markAsPaid() {
        if (!PENDING.equals(status)) {
            throw new IllegalStateException(
                "Only pending payments can be marked as paid"
            );
        }
        this.status = PAID;
    }

    public void markAsFailed() {
        if (!PENDING.equals(status)) {
            throw new IllegalStateException(
                "Only pending payments can be marked as failed"
            );
        }
        this.status = FAILED;
    }

    public void markAsRefunded() {
        if (!PAID.equals(status)) {
            throw new IllegalStateException(
                "Only paid payments can be refunded"
            );
        }
        this.status = REFUNDED;
    }
}
