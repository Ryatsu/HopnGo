package com.HopnGo.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
public class RideEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rideId;

    private String status;

    @Column(precision = 10, scale = 2)
    private BigDecimal fare;

    private LocalDateTime bookingTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Passenger relationship
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "passenger_id", nullable = false)
    private PassengerEntity passenger;

    // Driver relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private DriverEntity driver;

    // Pickup location
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pickup_location_id", nullable = false)
    private LocationEntity pickupLocation;

    // Destination location
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "destination_location_id", nullable = false)
    private LocationEntity destinationLocation;

    // Payment relationship
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id", unique = true)
    private PaymentEntity payment;

    protected RideEntity() {
    }

    public RideEntity(
            PassengerEntity passenger,
            LocationEntity pickupLocation,
            LocationEntity destinationLocation) {

        this.passenger = passenger;
        this.pickupLocation = pickupLocation;
        this.destinationLocation = destinationLocation;

        this.status = "REQUESTED";
        this.bookingTime = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getFare() {
        return fare;
    }

    public void setFare(BigDecimal fare) {
        this.fare = fare;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public PassengerEntity getPassenger() {
        return passenger;
    }

    public void setPassenger(PassengerEntity passenger) {
        this.passenger = passenger;
    }

    public DriverEntity getDriver() {
        return driver;
    }

    public void setDriver(DriverEntity driver) {
        this.driver = driver;
    }

    public LocationEntity getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(LocationEntity pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public LocationEntity getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(LocationEntity destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    public PaymentEntity getPayment() {
        return payment;
    }

    public void setPayment(PaymentEntity payment) {
        this.payment = payment;
    }

    // Ride operations

    public void cancelRide() {
        this.status = "CANCELLED";
    }

    public void startTrip() {
        this.status = "IN_PROGRESS";
        this.startTime = LocalDateTime.now();
    }

    public void endTrip() {
        this.status = "COMPLETED";
        this.endTime = LocalDateTime.now();
    }

    public void updateStatus(String status) {
        this.status = status;
    }
}