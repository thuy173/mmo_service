package com.example.mmoapi.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class EmptyException extends RuntimeException {
    private final String message;
}

