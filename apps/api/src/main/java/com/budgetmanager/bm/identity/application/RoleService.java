package com.budgetmanager.bm.identity.application;

import com.budgetmanager.bm.identity.domain.Role;
import com.budgetmanager.bm.identity.domain.UserRole;
import com.budgetmanager.bm.identity.infrastructure.http.RoleConverter;
import com.budgetmanager.bm.identity.infrastructure.http.RoleDto;
import com.budgetmanager.bm.identity.infrastructure.persistence.RoleRepository;
import com.budgetmanager.bm.shared.infrastructure.http.GlobalException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {

  private final RoleRepository repository;

  public Role save(RoleDto roleDto) {
    Role role = RoleConverter.dtoToEntity(roleDto);
    return repository.save(role);
  }

  public Role findByRoleName(UserRole userRole) {
    return repository
        .findByRoleName(userRole)
        .orElseThrow(
            () -> new GlobalException(HttpStatus.NOT_FOUND, "Role not found for {}", userRole));
  }
}
