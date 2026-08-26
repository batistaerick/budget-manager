package com.budgetmanager.bm.identity.infrastructure.http;

import com.budgetmanager.bm.identity.domain.UserRole;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.Builder;

@Builder
public record RoleDto(UUID id, @NotNull UserRole roleName) {}
