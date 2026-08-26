package com.budgetmanager.bm.savings.application;

import com.budgetmanager.bm.identity.application.UserService;
import com.budgetmanager.bm.identity.domain.User;
import com.budgetmanager.bm.savings.domain.Saving;
import com.budgetmanager.bm.savings.infrastructure.http.SavingConverter;
import com.budgetmanager.bm.savings.infrastructure.http.SavingDto;
import com.budgetmanager.bm.savings.infrastructure.persistence.SavingRepository;
import com.budgetmanager.bm.shared.infrastructure.http.GlobalException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SavingService {

  private final SavingRepository repository;
  private final UserService userService;

  @Transactional(readOnly = true)
  public List<Saving> findAll() {
    User user = getCurrentUser();
    return repository.findAllByUserIdOrderByLocationAscNameAsc(user.getId());
  }

  @Transactional
  public Saving save(SavingDto dto) {
    Saving saving = SavingConverter.dtoToEntity(dto);
    saving.setId(null);
    saving.setName(dto.name().trim());
    saving.setUser(getCurrentUser());
    return repository.save(saving);
  }

  @Transactional
  public Saving update(SavingDto dto) {
    User user = getCurrentUser();

    if (dto.id() == null) {
      throw new GlobalException(HttpStatus.BAD_REQUEST, "Saving id is required");
    }
    Saving saving =
        repository
            .findByIdAndUserId(dto.id(), user.getId())
            .orElseThrow(
                () ->
                    new GlobalException(HttpStatus.NOT_FOUND, "Saving not found for {}", dto.id()));
    saving.setName(dto.name().trim());
    saving.setAmount(dto.amount());
    saving.setLocation(dto.location());
    return repository.save(saving);
  }

  public void deleteById(UUID id) {
    User user = getCurrentUser();
    Saving saving =
        repository
            .findByIdAndUserId(id, user.getId())
            .orElseThrow(
                () -> new GlobalException(HttpStatus.NOT_FOUND, "Saving not found for {}", id));
    repository.delete(saving);
  }

  private User getCurrentUser() {
    return userService
        .getCurrentUser()
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
}
