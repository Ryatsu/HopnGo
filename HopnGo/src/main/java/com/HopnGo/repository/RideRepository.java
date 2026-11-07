package com.HopnGo.repository;

import com.HopnGo.entity.RideEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<RideEntity, Long> {

    List<RideEntity> findByPassenger_UserId(Long userId);

    List<RideEntity> findByDriver_UserId(Long userId);

    List<RideEntity> findByStatus(String status);
}