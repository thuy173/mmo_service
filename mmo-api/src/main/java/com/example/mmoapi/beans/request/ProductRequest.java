package com.example.mmoapi.beans.request;

import com.example.mmoapi.enums.CheckLiveAccountStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductRequest {
    private Integer subProductCategoryId;
    private String name;
    private double sellPrice;
    private double capitalPrice;
    private double discount;
    private CheckLiveAccountStatus checkLiveAccountStatus;
    private boolean isActive;
    private long minPurchaseQuantity;
    private long maxPurchaseQuantity;
    private String countryCode;
    private String shortDescription;
    private String detailDescription;
    private String noteFileTxt;
    private MultipartFile image;
    private int priorityNum;

}
