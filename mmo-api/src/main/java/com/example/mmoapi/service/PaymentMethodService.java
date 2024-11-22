package com.example.mmoapi.service;

import com.example.mmoapi.beans.request.PaymentMethodRequest;
import com.example.mmoapi.beans.response.paymentMethod.PaymentMethodResponse;
import com.example.mmoapi.beans.response.paymentMethod.ShortPaymentMethodRes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PaymentMethodService {
    List<PaymentMethodResponse> getAllPaymentMethods();
    List<ShortPaymentMethodRes> getAllShortPaymentMethods();
    void addPaymentMethod(PaymentMethodRequest paymentMethodRequest);
    void updatePaymentMethod(Integer id, PaymentMethodRequest paymentMethodRequest);
    void deletePaymentMethod(Integer id);
}
