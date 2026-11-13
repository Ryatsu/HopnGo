
package com.HopnGo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "locations")
public class LocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    private String address;

    private double latitude;
    private double longitude;

    protected LocationEntity() {
    }

    public LocationEntity(String address, double latitude, double longitude) {
        setAddress(address);
        setLatitude(latitude);
        setLongitude(longitude);
    }

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        if (address == null || address.isBlank()) {
            throw new IllegalArgumentException(
                "Address cannot be empty"
            );
        }

        this.address = address;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        if (!Double.isFinite(latitude)
                || latitude < -90 || latitude > 90) {
            throw new IllegalArgumentException(
                "Latitude must be between -90 and 90"
            );
        }

        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        if (!Double.isFinite(longitude)
                || longitude < -180 || longitude > 180) {
            throw new IllegalArgumentException(
                "Longitude must be between -180 and 180"
            );
        }

        this.longitude = longitude;
    }

    public String getCoordinates() {
        return latitude + ", " + longitude;
    }
}
