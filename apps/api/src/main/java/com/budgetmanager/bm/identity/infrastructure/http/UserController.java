package com.budgetmanager.bm.identity.infrastructure.http;

import static org.springframework.http.ResponseEntity.*;

import com.budgetmanager.bm.identity.application.UserService;
import com.budgetmanager.bm.identity.domain.User;
import com.budgetmanager.bm.shared.infrastructure.http.GlobalException;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService service;

  @PostMapping
  public ResponseEntity<UserDto> save(@Valid @RequestBody UserDto userDto) {
    User user = service.save(userDto);

    URI uri =
        ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(user.getId())
            .toUri();

    return created(uri).body(UserConverter.entityToDto(user));
  }

  @PutMapping
  public ResponseEntity<Void> updateUser(@RequestBody UserDto dto) {
    service.updateUser(dto);
    return noContent().build();
  }

  @GetMapping("/current")
  public ResponseEntity<UserDto> findCurrentUser() {
    return ok(
        UserConverter.entityToDto(
            service
                .getCurrentUser()
                .orElseThrow(() -> new GlobalException(HttpStatus.NOT_FOUND, "User Not Found"))));
  }
}
