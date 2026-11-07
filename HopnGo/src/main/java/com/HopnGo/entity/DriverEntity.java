package com.HopnGo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "drivers")
@PrimaryKeyJoinColumn(name = "user_id")
public class DriverEntity extends UserEntity {

    private String licenseNo;
    private double rating;
    private boolean available;

    protected DriverEntity() {
    }

    public DriverEntity(
            String name,
            String phone,
            String email,
            String licenseNo,
            double rating,
            boolean available) {

        super(name, phone, email);

        this.licenseNo = licenseNo;
        this.rating = rating;
        this.available = available;
    }

    public String getLicenseNo() {
        return licenseNo;
    }

    public void setLicenseNo(String licenseNo) {
        this.licenseNo = licenseNo;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    @Override
    public String getRole() {
        return "DRIVER";
    }
}