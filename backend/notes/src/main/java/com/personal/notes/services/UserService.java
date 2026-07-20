package com.personal.notes.services;

import com.personal.notes.dtos.UserDTO;
import com.personal.notes.models.User;

import java.util.List;

public interface UserService {
    void updateUserRole(Long userId, String roleName);

    List<User> getAllUsers();

    UserDTO getUserById(Long id);

    public User findByUsername(String username);
}
