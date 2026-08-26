package com.budgetmanager.bm.converters;

import com.budgetmanager.bm.domain.dtos.InstallmentDto;
import com.budgetmanager.bm.domain.entities.Installment;

public final class InstallmentConverter {

  private InstallmentConverter() {}

  public static InstallmentDto entityToDto(Installment entity) {
    return InstallmentDto.builder()
        .id(entity.getId())
        .installmentNumber(entity.getInstallmentNumber())
        .totalInstallments(entity.getTotalInstallments())
        .amount(entity.getAmount())
        .dueDate(entity.getDueDate())
        .build();
  }

  public static Installment dtoToEntity(InstallmentDto dto) {
    return Installment.builder()
        .id(dto.id())
        .installmentNumber(dto.installmentNumber())
        .totalInstallments(dto.totalInstallments())
        .amount(dto.amount())
        .dueDate(dto.dueDate())
        .build();
  }
}
