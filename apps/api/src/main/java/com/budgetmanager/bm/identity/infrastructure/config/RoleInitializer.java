package com.budgetmanager.bm.identity.infrastructure.config;

import com.budgetmanager.bm.identity.domain.Role;
import com.budgetmanager.bm.identity.domain.UserRole;
import com.budgetmanager.bm.identity.infrastructure.persistence.RoleRepository;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleInitializer implements CommandLineRunner {

  private final RoleRepository roleRepository;

  @Override
  public void run(String... args) {
    Arrays.stream(UserRole.values())
        .forEach(
            userRole ->
                roleRepository
                    .findByRoleName(userRole)
                    .orElseGet(
                        () -> roleRepository.save(Role.builder().roleName(userRole).build())));
  }
}
