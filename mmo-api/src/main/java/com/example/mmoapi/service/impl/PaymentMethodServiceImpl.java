package com.example.mmoapi.service.impl;

import com.example.mmoapi.beans.request.PaymentMethodRequest;
import com.example.mmoapi.beans.response.paymentMethod.PaymentMethodResponse;
import com.example.mmoapi.beans.response.paymentMethod.ShortPaymentMethodRes;
import com.example.mmoapi.entity.PaymentMethod;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.mapper.PaymentMethodMapper;
import com.example.mmoapi.repository.PaymentMethodRepository;
import com.example.mmoapi.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodServiceImpl implements PaymentMethodService {
    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentMethodMapper paymentMethodMapper;

    @Override
    public List<PaymentMethodResponse> getAllPaymentMethods() {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAll();

        return paymentMethods.stream()
                .map(paymentMethodMapper::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ShortPaymentMethodRes> getAllShortPaymentMethods() {
        List<PaymentMethod> paymentMethods = paymentMethodRepository.findAll();

        return paymentMethods.stream()
                .map(paymentMethodMapper::convertToShortResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void addPaymentMethod(PaymentMethodRequest paymentMethodRequest) {
        PaymentMethod paymentMethod = new PaymentMethod();
        paymentMethodMapper.convertToRequest(paymentMethod, paymentMethodRequest);
        paymentMethodRepository.save(paymentMethod);
    }

    @Override
    public void updatePaymentMethod(Integer id, PaymentMethodRequest paymentMethodRequest) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Payment method with id " + id + " not found"));

        paymentMethodMapper.convertToRequest(paymentMethod, paymentMethodRequest);
        paymentMethodRepository.save(paymentMethod);
    }

    @Override
    public void deletePaymentMethod(Integer id) {
        paymentMethodRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Payment method with id " + id + " not found"));
        paymentMethodRepository.deleteById(id);
    }
}
