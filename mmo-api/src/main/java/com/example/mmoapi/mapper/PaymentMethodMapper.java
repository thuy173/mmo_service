package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.request.PaymentMethodRequest;
import com.example.mmoapi.beans.response.paymentMethod.PaymentMethodResponse;
import com.example.mmoapi.beans.response.paymentMethod.ShortPaymentMethodRes;
import com.example.mmoapi.entity.PaymentMethod;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PaymentMethodMapper {
    public void convertToRequest(PaymentMethod paymentMethod, PaymentMethodRequest paymentMethodRequest){
        paymentMethod.setName(paymentMethodRequest.getName());
        paymentMethod.setDescription(paymentMethodRequest.getDescription());
        paymentMethod.setCreatedAt(LocalDateTime.now());
        paymentMethod.setUpdatedAt(LocalDateTime.now());
    }

    public PaymentMethodResponse convertToResponse(PaymentMethod paymentMethod){
        PaymentMethodResponse paymentMethodResponse = new PaymentMethodResponse();
        paymentMethodResponse.setId(paymentMethod.getId());
        paymentMethodResponse.setName(paymentMethod.getName());
        paymentMethodResponse.setDescription(paymentMethod.getDescription());
        paymentMethodResponse.setCreatedAt(paymentMethod.getCreatedAt());
        paymentMethodResponse.setUpdatedAt(paymentMethod.getUpdatedAt());
        return paymentMethodResponse;
    }

    public ShortPaymentMethodRes convertToShortResponse(PaymentMethod paymentMethod){
        ShortPaymentMethodRes shortPaymentMethodRes = new ShortPaymentMethodRes();
        shortPaymentMethodRes.setId(paymentMethod.getId());
        shortPaymentMethodRes.setName(paymentMethod.getName());
        shortPaymentMethodRes.setDescription(paymentMethod.getDescription());
        return shortPaymentMethodRes;
    }
}
