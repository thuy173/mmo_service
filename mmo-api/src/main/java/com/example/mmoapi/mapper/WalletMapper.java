package com.example.mmoapi.mapper;

import com.example.mmoapi.beans.response.WalletResponse;
import com.example.mmoapi.entity.User;
import com.example.mmoapi.entity.Wallet;
import org.springframework.stereotype.Component;

@Component
public class WalletMapper {
    public WalletResponse convertToResponse(Wallet wallet){
        WalletResponse walletResponse = new WalletResponse();
        walletResponse.setBalance(wallet.getBalance());
        return walletResponse;
    }
}
