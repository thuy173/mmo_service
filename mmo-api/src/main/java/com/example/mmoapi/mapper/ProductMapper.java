package com.example.mmoapi.mapper;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.mmoapi.beans.request.ProductRequest;
import com.example.mmoapi.beans.response.product.ProductResponse;
import com.example.mmoapi.beans.response.product.ShortProductResponse;
import com.example.mmoapi.beans.response.productCategory.ShortSubProductCategoryRes;
import com.example.mmoapi.entity.Product;
import com.example.mmoapi.entity.ProductDetail;
import com.example.mmoapi.entity.SubProductCategory;
import com.example.mmoapi.exception.ResourceNotFoundException;
import com.example.mmoapi.repository.SubProductCategoryRepository;
import com.example.mmoapi.service.AccountService;
import com.example.mmoapi.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final SubProductCategoryRepository subProductCategoryRepository;
    private final UploadService uploadService;
    private final AccountService accountService;

    public void convertToRequest(Product product, ProductRequest productRequest){
        SubProductCategory subProductCategory = subProductCategoryRepository.findById(productRequest.getSubProductCategoryId())
                .orElseThrow(()-> new ResourceNotFoundException("Sub product category not found"));

        product.setSubProductCategory(subProductCategory);
        product.setName(productRequest.getName());
        product.setSellPrice(productRequest.getSellPrice());
        product.setCapitalPrice(productRequest.getCapitalPrice());
        product.setDiscount(productRequest.getDiscount());
        product.setCheckLiveAccountStatus(productRequest.getCheckLiveAccountStatus());
        product.setActive(productRequest.isActive());
    }

    public void convertToDetailRequest(ProductDetail productDetail, ProductRequest productRequest){
        productDetail.setMinPurchaseQuantity(productRequest.getMinPurchaseQuantity());
        productDetail.setMaxPurchaseQuantity(productRequest.getMaxPurchaseQuantity());
        productDetail.setCountryCode(productRequest.getCountryCode());
        productDetail.setShortDescription(productRequest.getShortDescription());

        if (productRequest.getImage() != null && !productRequest.getImage().isEmpty()) {
            String uploadUrl = uploadService.uploadFile(productRequest.getImage());
            productDetail.setImageUrl(uploadUrl);
        } else {
            productDetail.setImageUrl(productDetail.getImageUrl());
        }

        productDetail.setDetailDescription(productRequest.getDetailDescription());
        productDetail.setNoteFileTxt(productRequest.getNoteFileTxt());
        productDetail.setPriorityNum(productRequest.getPriorityNum());
        productDetail.setCreatedAt(LocalDateTime.now());
        productDetail.setUpdatedAt(LocalDateTime.now());

    }

    public ProductResponse convertToResponse(Product product, ProductDetail productDetail){
        ProductResponse productResponse = new ProductResponse();
        productResponse.setId(product.getId());
        productResponse.setName(product.getName());

        ShortSubProductCategoryRes productSubCategory = new ShortSubProductCategoryRes(
                product.getSubProductCategory().getId(),
                product.getSubProductCategory().getName(),
                product.getSubProductCategory().getIconUrl());
        productResponse.setProductSubCategory(productSubCategory);

        productResponse.setProductCode(product.getProductCode());
        productResponse.setSellPrice(product.getSellPrice());
        productResponse.setCapitalPrice(product.getCapitalPrice());
        productResponse.setDiscount(product.getDiscount());
        productResponse.setAvailableAccountQty(accountService.countAccountByProductIdAndIsSold(product.getId(), false));
        productResponse.setSoldAccountQty(accountService.countAccountByProductIdAndIsSold(product.getId(), true));
        productResponse.setCheckLiveAccountStatus(product.getCheckLiveAccountStatus());
        productResponse.setActive(product.isActive());

        productResponse.setMinPurchaseQuantity(productDetail.getMinPurchaseQuantity());
        productResponse.setMaxPurchaseQuantity(productDetail.getMaxPurchaseQuantity());
        productResponse.setCountryCode(productDetail.getCountryCode());
        productResponse.setShortDescription(productDetail.getShortDescription());
        productResponse.setDetailDescription(productDetail.getDetailDescription());
        productResponse.setNoteFileTxt(productDetail.getNoteFileTxt());
        productResponse.setImage(productDetail.getImageUrl());
        productResponse.setPriorityNum(productDetail.getPriorityNum());
        productResponse.setCreatedAt(productDetail.getCreatedAt());
        productResponse.setUpdatedAt(productDetail.getUpdatedAt());
        return productResponse;
    }

    public ShortProductResponse convertToShortResponse(Product product, ProductDetail productDetail){
        ShortProductResponse shortProductResponse = new ShortProductResponse();
        shortProductResponse.setId(product.getId());
        shortProductResponse.setName(product.getName());

        ShortSubProductCategoryRes productSubCategory = new ShortSubProductCategoryRes(
                product.getSubProductCategory().getId(),
                product.getSubProductCategory().getName(),
                product.getSubProductCategory().getIconUrl());
        shortProductResponse.setProductSubCategory(productSubCategory);

        shortProductResponse.setProductCode(product.getProductCode());
        shortProductResponse.setSellPrice(product.getSellPrice());
        shortProductResponse.setCapitalPrice(product.getCapitalPrice());
        shortProductResponse.setDiscount(product.getDiscount());
        shortProductResponse.setActive(product.isActive());
        shortProductResponse.setAvailableAccountQty(accountService.countAccountByProductIdAndIsSold(product.getId(), false));
        shortProductResponse.setSoldAccountQty(accountService.countAccountByProductIdAndIsSold(product.getId(), true));
        shortProductResponse.setCheckLiveAccountStatus(product.getCheckLiveAccountStatus());

        shortProductResponse.setCountryCode(productDetail.getCountryCode());
        shortProductResponse.setShortDescription(productDetail.getShortDescription());
        shortProductResponse.setImage(productDetail.getImageUrl());
        shortProductResponse.setPriorityNum(productDetail.getPriorityNum());
        shortProductResponse.setCreatedAt(productDetail.getCreatedAt());
        shortProductResponse.setUpdatedAt(productDetail.getUpdatedAt());
        return shortProductResponse;
    }
}
