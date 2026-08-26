package com.budgetmanager.bm.identity.infrastructure.persistence;

import com.budgetmanager.bm.identity.domain.UserImage;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserImageRepository extends JpaRepository<UserImage, UUID> {
  Optional<UserImage> findByUserEmail(String email);
}
