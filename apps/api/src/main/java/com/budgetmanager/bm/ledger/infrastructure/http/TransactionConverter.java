package com.budgetmanager.bm.ledger.infrastructure.http;

import com.budgetmanager.bm.ledger.domain.Transaction;
import java.util.List;
import java.util.Optional;

public final class TransactionConverter {

  private TransactionConverter() {}

  public static TransactionDto entityToDto(Transaction entity) {
    return TransactionDto.builder()
        .id(entity.getId())
        .notes(entity.getNotes())
        .repeats(entity.getRepeats())
        .date(entity.getDate())
        .totalValue(entity.getTotalValue())
        .installmentNumbers(entity.getInstallmentNumbers())
        .category(CategoryConverter.entityToDto(entity.getCategory()))
        .installments(
            Optional.ofNullable(entity.getInstallments()).orElse(List.of()).stream()
                .map(InstallmentConverter::entityToDto)
                .toList())
        .build();
  }

  public static Transaction dtoToEntity(TransactionDto dto) {
    return Transaction.builder()
        .id(dto.id())
        .notes(dto.notes())
        .repeats(dto.repeats())
        .date(dto.date())
        .totalValue(dto.totalValue())
        .installmentNumbers(dto.installmentNumbers())
        .category(CategoryConverter.dtoToEntity(dto.category()))
        .installments(
            Optional.ofNullable(dto.installments()).orElse(List.of()).stream()
                .map(InstallmentConverter::dtoToEntity)
                .toList())
        .build();
  }
}
