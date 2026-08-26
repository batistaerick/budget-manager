package com.budgetmanager.bm.savings.infrastructure.http;

import com.budgetmanager.bm.savings.domain.Saving;

public class SavingConverter {

  public static Saving dtoToEntity(SavingDto dto) {
    return Saving.builder()
        .id(dto.id())
        .name(dto.name())
        .amount(dto.amount())
        .location(dto.location())
        .build();
  }

  public static SavingDto entityToDto(Saving saving) {
    return SavingDto.builder()
        .id(saving.getId())
        .name(saving.getName())
        .amount(saving.getAmount())
        .location(saving.getLocation())
        .build();
  }
}
