package com.budgetmanager.bm.savings.infrastructure.http;

import com.budgetmanager.bm.savings.domain.SavingLocation;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.Builder;

@Builder
public record SavingDto(
    UUID id,
    @NotBlank String name,
    @NotNull @DecimalMin(value = "0.00") BigDecimal amount,
    @NotNull SavingLocation location) {}
