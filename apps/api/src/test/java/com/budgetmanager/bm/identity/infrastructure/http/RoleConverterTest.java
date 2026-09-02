package com.budgetmanager.bm.identity.infrastructure.http;

import static org.assertj.core.api.Assertions.assertThat;

import com.budgetmanager.bm.identity.domain.Role;
import com.budgetmanager.bm.identity.domain.UserRole;
import org.junit.jupiter.api.Test;

class RoleConverterTest {

  @Test
  void entityToDtoRemovesSecurityAuthorityPrefix() {
    Role role = Role.builder().roleName(UserRole.ROLE_USER).build();

    RoleDto dto = RoleConverter.entityToDto(role);

    assertThat(dto.roleName()).isEqualTo(ApiUserRole.USER);
  }

  @Test
  void dtoToEntityRestoresSecurityAuthorityPrefix() {
    RoleDto dto = RoleDto.builder().roleName(ApiUserRole.ADMIN).build();

    Role role = RoleConverter.dtoToEntity(dto);

    assertThat(role.getRoleName()).isEqualTo(UserRole.ROLE_ADMIN);
  }
}
