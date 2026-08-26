package com.budgetmanager.bm.identity.application;

import com.budgetmanager.bm.identity.domain.RefreshToken;
import com.budgetmanager.bm.identity.domain.User;
import com.budgetmanager.bm.identity.infrastructure.persistence.RefreshTokenRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

  private final RefreshTokenRepository repository;

  public void deleteByUser(User user) {
    repository.deleteByUser(user);
  }

  public RefreshToken save(RefreshToken refreshToken) {
    return repository.save(refreshToken);
  }

  public Optional<RefreshToken> findByToken(String token) {
    return repository.findByToken(token);
  }
}
