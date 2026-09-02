package com.budgetmanager.bm.identity.infrastructure.http;

import com.budgetmanager.bm.identity.domain.Role;
import com.budgetmanager.bm.identity.domain.UserRole;

public final class RoleConverter {

  private RoleConverter() {}

  public static RoleDto entityToDto(Role entity) {
    return RoleDto.builder().id(entity.getId()).roleName(toApiRole(entity.getRoleName())).build();
  }

  public static Role dtoToEntity(RoleDto dto) {
    return Role.builder().id(dto.id()).roleName(toDomainRole(dto.roleName())).build();
  }

  private static ApiUserRole toApiRole(UserRole role) {
    return switch (role) {
      case ROLE_ADMIN -> ApiUserRole.ADMIN;
      case ROLE_USER -> ApiUserRole.USER;
    };
  }

  private static UserRole toDomainRole(ApiUserRole role) {
    return switch (role) {
      case ADMIN -> UserRole.ROLE_ADMIN;
      case USER -> UserRole.ROLE_USER;
    };
  }
}
