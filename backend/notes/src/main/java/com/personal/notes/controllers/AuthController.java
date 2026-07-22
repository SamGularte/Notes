package com.personal.notes.controllers;

import com.personal.notes.exceptions.InvalidCredentialsException;
import com.personal.notes.exceptions.DuplicateResourceException;
import com.personal.notes.models.Role;
import com.personal.notes.models.User;
import com.personal.notes.models.enums.AppRole;
import com.personal.notes.repositories.RoleRepository;
import com.personal.notes.repositories.UserRepository;
import com.personal.notes.security.jwt.JwtUtils;
import com.personal.notes.security.request.LoginRequest;
import com.personal.notes.security.request.SignupRequest;
import com.personal.notes.security.response.LoginResponse;
import com.personal.notes.security.response.MessageResponse;
import com.personal.notes.security.response.UserInfoResponse;
import com.personal.notes.services.TotpService;
import com.personal.notes.services.UserService;
import com.personal.notes.services.impl.UserDetailsImpl;
import com.personal.notes.util.AuthUtil;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@Validated
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserService userService;

    @Autowired
    AuthUtil authUtil;

    @Autowired
    TotpService totpService;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/public/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (AuthenticationException exception) {
            throw new InvalidCredentialsException("Bad credentials");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwtToken = jwtUtils.generateTokenFromUsername(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        LoginResponse response = new LoginResponse(jwtToken, userDetails.getUsername(), roles);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/public/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            throw new DuplicateResourceException("User", "username", signUpRequest.getUsername());
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new DuplicateResourceException("User", "email", signUpRequest.getEmail());
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Role role = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        user.setAccountNonLocked(true);
        user.setAccountNonExpired(true);
        user.setCredentialsNonExpired(true);
        user.setEnabled(true);
        user.setCredentialsExpiryDate(LocalDate.now().plusYears(1));
        user.setAccountExpiryDate(LocalDate.now().plusYears(1));
        user.setTwoFactorEnabled(false);
        user.setSignUpMethod("email");
        user.setRole(role);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findByUsername(userDetails.getUsername());

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.isAccountNonLocked(),
                user.isAccountNonExpired(),
                user.isCredentialsNonExpired(),
                user.isEnabled(),
                user.getCredentialsExpiryDate(),
                user.getAccountExpiryDate(),
                user.isTwoFactorEnabled(),
                roles
        );

        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/username")
    public String currentUserName(@AuthenticationPrincipal UserDetails userDetails) {
        return (userDetails != null) ? userDetails.getUsername() : "";
    }

    @PostMapping("/public/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam @Email @NotBlank String email){
        userService.generatePasswordResetToken(email);
        return ResponseEntity.ok(new MessageResponse("Password reset email sent"));
    }

    @PostMapping("/public/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam @NotBlank String token, @RequestParam @NotBlank @Size(min = 6, max = 40) String newPassword){
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok(new MessageResponse("Password reset successful"));
    }

    @PostMapping("/enable-2fa")
    public ResponseEntity<String> enable2FA(){
        Long userId = Long.valueOf(authUtil.loggedInUserId());
        GoogleAuthenticatorKey secret = userService.generate2FASecret(userId);
        String qrCodeUrl = totpService.getQrCodeUrl(secret, userService.getUserById(userId).getUserName());
        return ResponseEntity.ok(qrCodeUrl);
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<String> disable2FA(){
        Long userId = Long.valueOf(authUtil.loggedInUserId());
        userService.disable2FA(userId);
        return ResponseEntity.ok("2FA disabled");
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<String> verify2FA(@RequestParam int code){
        Long userId = Long.valueOf(authUtil.loggedInUserId());
        boolean isValid = userService.validate2FACode(userId, code);
        if(isValid){
            userService.enable2FA(userId);
            return ResponseEntity.ok("2FA Verified");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid 2FA code");
        }
    }

    @GetMapping("/user/2fa-status")
    public ResponseEntity<?> get2FaStatus(){
        User user = authUtil.loggedInUser();
        if(user != null){
            return ResponseEntity.ok().body(Map.of("is2faEnabled", user.isTwoFactorEnabled()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PutMapping("/update-expiry-status")
    public ResponseEntity<?> updateExpiryStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam boolean expire) {
        User user = userService.findByUsername(userDetails.getUsername());
        user.setAccountNonExpired(!expire);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Account expiry status updated"));
    }

    @PutMapping("/update-lock-status")
    public ResponseEntity<?> updateLockStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam boolean lock) {
        User user = userService.findByUsername(userDetails.getUsername());
        user.setAccountNonLocked(!lock);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Account lock status updated"));
    }

    @PutMapping("/update-enabled-status")
    public ResponseEntity<?> updateEnabledStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam boolean enabled) {
        User user = userService.findByUsername(userDetails.getUsername());
        user.setEnabled(enabled);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Account enabled status updated"));
    }

    @PutMapping("/update-credentials-expiry-status")
    public ResponseEntity<?> updateCredentialsExpiryStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam boolean expire) {
        User user = userService.findByUsername(userDetails.getUsername());
        user.setCredentialsNonExpired(!expire);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Credentials expiry status updated"));
    }

    @PutMapping("/update-credentials")
    public ResponseEntity<?> updateCredentials(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @NotBlank @Size(min = 3, max = 20) String newUsername,
            @RequestParam @Size(max = 40) String newPassword) {
        User user = userService.findByUsername(userDetails.getUsername());
        if (!newUsername.equals(user.getUserName())) {
            if (userRepository.existsByUserName(newUsername)) {
                throw new DuplicateResourceException("User", "username", newUsername);
            }
            user.setUserName(newUsername);
        }
        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(encoder.encode(newPassword));
        }
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Credentials updated successfully"));
    }

    @PostMapping("/public/verify-2fa-login")
    public ResponseEntity<String> verify2FALogin(@RequestParam int code, @RequestParam String jwtToken){
        String username = jwtUtils.getUserNameFromJwtToken(jwtToken);
        User user = userService.findByUsername(username);
        boolean isValid = userService.validate2FACode(user.getUserId(), code);
        if(isValid){
            return ResponseEntity.ok("2FA Verified");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid 2FA code");
        }
    }

}
