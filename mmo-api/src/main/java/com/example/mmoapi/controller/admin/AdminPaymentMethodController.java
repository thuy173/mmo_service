package com.example.mmoapi.controller.admin;

import com.example.mmoapi.beans.request.PaymentMethodRequest;
import com.example.mmoapi.beans.response.paymentMethod.PaymentMethodResponse;
import com.example.mmoapi.service.PaymentMethodService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payment-methods")
@RequiredArgsConstructor
@Tag(name = "AdminPaymentMethods")
public class AdminPaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<List<PaymentMethodResponse>> getAllPaymentMethods() {
        List<PaymentMethodResponse> paymentMethods = paymentMethodService.getAllPaymentMethods();

        return ResponseEntity.ok(paymentMethods);
    }

    @PostMapping
    public ResponseEntity<Void> createPaymentMethod(@RequestBody PaymentMethodRequest paymentMethodRequest) {
        paymentMethodService.addPaymentMethod(paymentMethodRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePaymentMethod(@PathVariable Integer id, @RequestBody PaymentMethodRequest paymentMethodRequest) {
        paymentMethodService.updatePaymentMethod(id, paymentMethodRequest);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Integer id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.noContent().build();
    }
}
