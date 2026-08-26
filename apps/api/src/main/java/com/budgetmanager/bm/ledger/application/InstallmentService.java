package com.budgetmanager.bm.ledger.application;

import com.budgetmanager.bm.ledger.domain.Installment;
import com.budgetmanager.bm.ledger.infrastructure.http.InstallmentConverter;
import com.budgetmanager.bm.ledger.infrastructure.http.InstallmentDto;
import com.budgetmanager.bm.ledger.infrastructure.persistence.InstallmentRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstallmentService {

  private final InstallmentRepository repository;

  public Installment save(InstallmentDto dto) {
    return repository.save(InstallmentConverter.dtoToEntity(dto));
  }

  public List<Installment> saveAll(List<Installment> installments) {
    return repository.saveAll(installments);
  }
}
