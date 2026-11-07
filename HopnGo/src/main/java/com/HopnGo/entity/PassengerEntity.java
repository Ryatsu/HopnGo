package com.HopnGo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "passengers")
@PrimaryKeyJoinColumn(name = "user_id")
public class PassengerEntity extends UserEntity {

    private double rating;

    protected PassengerEntity() {
    }

    public PassengerEntity(
            String name,
            String phone,
            String email,
            double rating) {

        super(name, phone, email);
        this.rating = rating;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    @Override
    public String getRole() {
        return "PASSENGER";
    }
}