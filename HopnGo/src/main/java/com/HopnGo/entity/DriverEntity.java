
package com.HopnGo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "drivers")
@PrimaryKeyJoinColumn(name = "user_id")
public class DriverEntity extends UserEntity {

    private String licenseNo;
    private double rating;
    private boolean available;

    // Required by JPA
    protected DriverEntity() {
    }

    // Constructor
    public DriverEntity(
            String name,
            String phone,
            String email,
            String licenseNo,
            double rating,
            boolean available) {

        super(name, phone, email);

        setLicenseNo(licenseNo);
        setRating(rating);
        this.available = available;
    }

    // License number
    public String getLicenseNo() {
        return licenseNo;
    }

    public void setLicenseNo(String licenseNo) {

        if (licenseNo == null || licenseNo.isBlank()) {
            throw new IllegalArgumentException(
                "License number cannot be empty"
            );
        }

        this.licenseNo = licenseNo;
    }

    // Rating
    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {

        if (rating < 0.0 || rating > 5.0) {
            throw new IllegalArgumentException(
                "Driver rating must be between 0 and 5"
            );
        }

        this.rating = rating;
    }

    // Availability
    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    // OOP behavior: accept a ride
    public void acceptRide() {

        if (!available) {
            throw new IllegalStateException(
                "Driver is not available"
            );
        }

        this.available = false;
    }

    // OOP behavior: complete a ride
    public void completeRide() {

        if (available) {
            throw new IllegalStateException(
                "Driver is already available"
            );
        }

        this.available = true;
    }

    // Polymorphism
    @Override
    public String getRole() {
        return "DRIVER";
    }
}
