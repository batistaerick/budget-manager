package com.budgetmanager.bm.shared.infrastructure.http;

import org.springframework.http.HttpStatus;

public record ErrorResponseBody(HttpStatus status, String title, String message) {}
