
package com.HopnGo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "passengers")
@PrimaryKeyJoinColumn(name = "user_id")
public class PassengerEntity extends UserEntity {

    private double rating;

    // Required by JPA
    protected PassengerEntity() {
    }

    // Constructor
    public PassengerEntity(
            String name,
            String phone,
            String email,
            double rating) {

        super(name, phone, email);
        setRating(rating);
    }

    // Getter
    public double getRating() {
        return rating;
    }

    // Setter with validation
    public void setRating(double rating) {

        if (rating < 0.0 || rating > 5.0) {
            throw new IllegalArgumentException(
                "Passenger rating must be between 0 and 5"
            );
        }

        this.rating = rating;
    }

    // Polymorphism: Passenger-specific role
    @Override
    public String getRole() {
        return "PASSENGER";
    }
}
