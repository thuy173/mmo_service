package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.request.account.AccountFileRequest;
import com.example.mmoapi.beans.request.account.AccountTextRequest;
import com.example.mmoapi.beans.response.account.AccountAvailableRes;
import com.example.mmoapi.beans.response.account.AccountSoldRes;
import com.example.mmoapi.service.AccountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
@Tag(name = "AdminAccounts")
public class AdminAccountController {
    private final AccountService accountService;

    @GetMapping("/available")
    public ResponseEntity<Page<AccountAvailableRes>> getAllAvailableAccounts(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String productCode,
            @RequestParam(required = false) LocalDateTime createdAt,
            @RequestParam(required = false) Integer daysRange,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Page<AccountAvailableRes> accounts = accountService.getAllAvailableAccount(username, productCode, createdAt, daysRange, pageNumber, pageSize, sortField, sortDirection);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/available-by-product/{productId}")
    public ResponseEntity<Page<AccountAvailableRes>> getAllAvailableAccountsByProduct(
            @PathVariable Long productId,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) LocalDateTime createdAt,
            @RequestParam(required = false) Integer daysRange,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Page<AccountAvailableRes> accounts = accountService.getAllAvailableAccountByProductId(productId, username, createdAt, daysRange, pageNumber, pageSize, sortField, sortDirection);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/sold")
    public ResponseEntity<Page<AccountSoldRes>> getAllSoldAccounts(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String productCode,
            @RequestParam(required = false) String orderCode,
            @RequestParam(required = false) LocalDateTime createdAt,
            @RequestParam(required = false) Integer daysRange,
            @RequestParam(required = false, defaultValue = "0") int pageNumber,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortField,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
    ) {
        Page<AccountSoldRes> accounts = accountService.getAllSoldAccount(username, productCode, orderCode, createdAt, daysRange, pageNumber, pageSize, sortField, sortDirection);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/sold-by-order/{orderId}")
    public ResponseEntity<String> getAllSoldAccounts(@PathVariable String orderId) {
        String accounts = accountService.getAllSoldAccountByOrderId(orderId);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/text")
    public ResponseEntity<Void> createManyAccount(@ModelAttribute AccountTextRequest accountTextRequest) {
        accountService.addManyAccount(accountTextRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> createAccountFile(@ModelAttribute AccountFileRequest accountFileRequest) {
        MultipartFile file = accountFileRequest.getFile();

        if (file != null && file.getOriginalFilename() != null && file.getOriginalFilename().endsWith(".txt")) {
            accountService.addAccountFile(accountFileRequest);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } else {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable String id){
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/available-by-product/{productId}")
    public ResponseEntity<Void> deleteAvailableAccountByProduct(@PathVariable Long productId){
        accountService.deleteAllAccountByProductId(productId);
        return ResponseEntity.noContent().build();
    }

}
