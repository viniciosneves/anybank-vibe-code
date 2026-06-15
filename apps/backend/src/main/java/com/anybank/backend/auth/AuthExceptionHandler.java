package com.anybank.backend.auth;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.MessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

/**
 * Global exception handler. Translates domain and framework exceptions into a
 * consistent JSON error body so every endpoint returns a readable message
 * instead of a bare HTTP status code. Validation failures additionally include
 * a per-field {@code errors} array.
 */
@RestControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<Map<String, Object>> handleEmailAlreadyUsed(EmailAlreadyUsedException ex) {
        return error(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidRefreshToken(InvalidRefreshTokenException ex) {
        return error(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    /** Body (@RequestBody @Valid) validation failures. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<Map<String, String>> fields = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fieldError(fe.getField(), fe.getDefaultMessage()))
                .toList();
        return validationError(fields);
    }

    /** Query/path parameter (@Validated) validation failures. */
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<Map<String, Object>> handleHandlerValidation(HandlerMethodValidationException ex) {
        List<Map<String, String>> fields = ex.getAllErrors().stream()
                .map(err -> fieldError(resolveField(err), err.getDefaultMessage()))
                .toList();
        return validationError(fields);
    }

    /** Missing or malformed JSON body. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleUnreadableBody(HttpMessageNotReadableException ex) {
        return error(HttpStatus.BAD_REQUEST, "Request body is missing or malformed");
    }

    private ResponseEntity<Map<String, Object>> validationError(List<Map<String, String>> fields) {
        Map<String, Object> body = baseBody(HttpStatus.BAD_REQUEST, "Validation failed");
        body.put("errors", fields);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    private Map<String, String> fieldError(String field, String message) {
        return Map.of("field", field, "message", message == null ? "invalid" : message);
    }

    private String resolveField(MessageSourceResolvable err) {
        return err instanceof FieldError fe ? fe.getField() : "request";
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(baseBody(status, message));
    }

    private Map<String, Object> baseBody(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return body;
    }
}
