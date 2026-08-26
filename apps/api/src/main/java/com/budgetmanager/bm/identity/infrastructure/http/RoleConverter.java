package com.budgetmanager.bm.identity.infrastructure.http;

import com.budgetmanager.bm.identity.domain.Role;

public final class RoleConverter {

  private RoleConverter() {}

  public static RoleDto entityToDto(Role entity) {
    return RoleDto.builder().id(entity.getId()).roleName(entity.getRoleName()).build();
  }

  public static Role dtoToEntity(RoleDto dto) {
    return Role.builder().id(dto.id()).roleName(dto.roleName()).build();
  }
}
