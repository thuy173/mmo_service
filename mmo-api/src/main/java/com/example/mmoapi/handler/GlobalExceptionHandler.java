package com.example.mmoapi.handler;

import com.example.mmoapi.beans.response.ResponseMessage;
import com.example.mmoapi.exception.BadRequestException;
import com.example.mmoapi.exception.ConflictException;
import com.example.mmoapi.exception.EmptyException;
import com.example.mmoapi.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public @ResponseBody ResponseMessage handleDataNotFoundException(ResourceNotFoundException e) {
        return new ResponseMessage(HttpStatus.NOT_FOUND.value(), e.getMessage());
    }

    @ExceptionHandler(EmptyException.class)
    public @ResponseBody ResponseMessage handleEmptyException(EmptyException e) {
        return new ResponseMessage(HttpStatus.NO_CONTENT.value(), e.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public @ResponseBody ResponseMessage handleDuplicateException(BadRequestException e) {
        return new ResponseMessage(HttpStatus.BAD_REQUEST.value(), e.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public @ResponseBody ResponseMessage handleConflictException(ConflictException e) {
        return new ResponseMessage(HttpStatus.CONFLICT.value(), e.getMessage());
    }
}
