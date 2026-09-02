package com.budgetmanager.bm.identity.infrastructure.http;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import lombok.Builder;

@Builder
public record RoleDto(UUID id, @NotNull ApiUserRole roleName) {}
