package com.example.mmoapi.controller.site;

import com.example.mmoapi.beans.response.paymentMethod.PaymentMethodResponse;
import com.example.mmoapi.beans.response.paymentMethod.ShortPaymentMethodRes;
import com.example.mmoapi.service.PaymentMethodService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@Tag(name = "PaymentMethods")
public class PaymentMethodController {
    private final PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<List<ShortPaymentMethodRes>> getAllPaymentMethods() {
        List<ShortPaymentMethodRes> paymentMethods = paymentMethodService.getAllShortPaymentMethods();

        return ResponseEntity.ok(paymentMethods);
    }
}
