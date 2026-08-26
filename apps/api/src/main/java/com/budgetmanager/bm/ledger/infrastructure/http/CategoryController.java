package com.budgetmanager.bm.ledger.infrastructure.http;

import static org.springframework.http.ResponseEntity.created;
import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.http.ResponseEntity.status;

import com.budgetmanager.bm.ledger.application.CategoryService;
import com.budgetmanager.bm.ledger.domain.Category;
import com.budgetmanager.bm.ledger.domain.TransactionType;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

  private final CategoryService service;

  @PostMapping
  public ResponseEntity<CategoryDto> save(@Valid @RequestBody CategoryDto dto) {
    Category category = service.save(dto);

    URI uri =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(category.getId())
            .toUri();

    return created(uri).body(CategoryConverter.entityToDto(category));
  }

  @PostMapping("/bulk")
  public ResponseEntity<List<CategoryDto>> saveAll(
      @Valid @RequestBody List<@Valid CategoryDto> dtos) {
    List<CategoryDto> categories =
        service.saveAll(dtos).stream().map(CategoryConverter::entityToDto).toList();

    return status(HttpStatus.CREATED).body(categories);
  }

  @GetMapping("/type/{transactionType}")
  public ResponseEntity<List<Category>> findByTransactionType(
      @PathVariable TransactionType transactionType) {
    return ok(service.findByTransactionType(transactionType));
  }
}
