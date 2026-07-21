package com.personal.notes.services;

import com.personal.notes.dtos.UserDTO;
import com.personal.notes.models.Role;
import com.personal.notes.models.User;

import java.util.List;

public interface UserService {
    void updateUserRole(Long userId, String roleName);

    List<User> getAllUsers();

    UserDTO getUserById(Long id);

    public User findByUsername(String username);

    void updateAccountLockStatus(Long userId, boolean lock);

    List<Role> getAllRoles();

    void updateAccountExpiryStatus(Long userId, boolean expire);

    void updateAccountEnabledStatus(Long userId, boolean enabled);

    void updatePassword(Long userId, String password);

    void updateCredentialsExpiryStatus(Long userId, boolean expire);
}
