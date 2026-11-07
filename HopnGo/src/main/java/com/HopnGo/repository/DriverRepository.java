package com.HopnGo.repository;

import com.HopnGo.entity.DriverEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DriverRepository extends JpaRepository<DriverEntity, Long> {

    List<DriverEntity> findByAvailableTrue();
}