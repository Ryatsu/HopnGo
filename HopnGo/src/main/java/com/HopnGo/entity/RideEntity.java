
package com.HopnGo.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "rides")
public class RideEntity {

    // Ride statuses
    public static final String REQUESTED = "REQUESTED";
    public static final String ACCEPTED = "ACCEPTED";
    public static final String CANCELLED = "CANCELLED";
    public static final String IN_PROGRESS = "IN_PROGRESS";
    public static final String COMPLETED = "COMPLETED";

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

    // Required by JPA
    protected RideEntity() {
    }

    // Constructor
    public RideEntity(
            PassengerEntity passenger,
            LocationEntity pickupLocation,
            LocationEntity destinationLocation) {

        this.passenger = Objects.requireNonNull(
            passenger, "Passenger cannot be null"
        );

        this.pickupLocation = Objects.requireNonNull(
            pickupLocation, "Pickup location cannot be null"
        );

        this.destinationLocation = Objects.requireNonNull(
            destinationLocation, "Destination location cannot be null"
        );

        this.status = REQUESTED;
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
        updateStatus(status);
    }

    public BigDecimal getFare() {
        return fare;
    }

    public void setFare(BigDecimal fare) {
        if (fare != null && fare.signum() < 0) {
            throw new IllegalArgumentException(
                "Fare cannot be negative"
            );
        }

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
        this.passenger = Objects.requireNonNull(
            passenger, "Passenger cannot be null"
        );
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
        this.pickupLocation = Objects.requireNonNull(
            pickupLocation, "Pickup location cannot be null"
        );
    }

    public LocationEntity getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(LocationEntity destinationLocation) {
        this.destinationLocation = Objects.requireNonNull(
            destinationLocation, "Destination location cannot be null"
        );
    }

    public PaymentEntity getPayment() {
        return payment;
    }

    public void setPayment(PaymentEntity payment) {
        this.payment = payment;
    }

    // Ride operations

    public void cancelRide() {

        if (!REQUESTED.equals(status) && !ACCEPTED.equals(status)) {
            throw new IllegalStateException(
                "Only requested or accepted rides can be cancelled"
            );
        }

        this.status = CANCELLED;
    }

    public void startTrip() {

        if (!ACCEPTED.equals(status)) {
            throw new IllegalStateException(
                "Ride must be accepted before starting"
            );
        }

        this.status = IN_PROGRESS;
        this.startTime = LocalDateTime.now();
    }

    public void endTrip() {

        if (!IN_PROGRESS.equals(status)) {
            throw new IllegalStateException(
                "Ride must be in progress before completing"
            );
        }

        this.status = COMPLETED;
        this.endTime = LocalDateTime.now();
    }

    // Controls valid status transitions
    public void updateStatus(String status) {

        if (status == null) {
            throw new IllegalArgumentException(
                "Ride status cannot be null"
            );
        }

        if (REQUESTED.equals(this.status)
                && ACCEPTED.equals(status)) {

            this.status = status;

        } else {
            throw new IllegalStateException(
                "Invalid ride status transition: "
                + this.status + " to " + status
            );
        }
    }
}
