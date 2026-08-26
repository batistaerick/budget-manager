package com.budgetmanager.bm.identity.infrastructure.persistence;

import com.budgetmanager.bm.identity.domain.RefreshToken;
import com.budgetmanager.bm.identity.domain.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
  Optional<RefreshToken> findByToken(String token);

  Optional<RefreshToken> findByUser(User user);

  @Transactional
  void deleteByUser(User user);
}
