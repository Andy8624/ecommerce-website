package com.dlk.ct466.controller;

import com.dlk.ct466.domain.entity.User;
import com.dlk.ct466.domain.response.ResPaginationDTO;
import com.dlk.ct466.domain.response.user.ResCreateUserDTO;
import com.dlk.ct466.domain.response.user.ResUpdateUserDTO;
import com.dlk.ct466.domain.response.user.ResUserDTO;
import com.dlk.ct466.service.UserService;
import com.dlk.ct466.util.annotation.ApiMessage;
import com.dlk.ct466.util.error.IdInvalidException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    @ApiMessage("Get User by id")
    public ResponseEntity<ResUserDTO> getById(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(userService.getUserByIdDTO(id));
    }

    @PostMapping
    @ApiMessage("Create a user")
    public ResponseEntity<ResCreateUserDTO> create(@Valid @RequestBody User user) throws IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @PutMapping("/{id}")
    @ApiMessage("Update a user")
    public ResponseEntity<ResUpdateUserDTO> update(@PathVariable("id") String id, @RequestBody User user) throws IdInvalidException {
        return ResponseEntity.ok(userService.updateUser(user, id));
    }

    @PostMapping("/user-role")
    @ApiMessage("Update user role")
    public ResponseEntity<Void> updateUserRole(@RequestBody User user) throws IdInvalidException {
        return ResponseEntity.ok(userService.updateUserRole(user));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a user")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(userService.deleteUser(id));
    }

    @PatchMapping("{id}")
    @ApiMessage("Restore a user")
    public ResponseEntity<Void> restore(@PathVariable("id") String id) throws IdInvalidException {
        return ResponseEntity.ok(userService.restoreUser(id));
    }

    @GetMapping
    @ApiMessage("Get all users")
    public ResponseEntity<ResPaginationDTO> getAllUser(
            Pageable pageable
    ) {
        return ResponseEntity.ok(userService.getAllUser(pageable));
    }

}
