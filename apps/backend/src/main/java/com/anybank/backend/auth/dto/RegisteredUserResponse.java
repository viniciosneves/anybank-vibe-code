package com.anybank.backend.auth.dto;

import java.util.UUID;

import com.anybank.backend.user.User;

public record RegisteredUserResponse(UUID id, String name, String email) {
    public static RegisteredUserResponse from(User user) {
        return new RegisteredUserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
