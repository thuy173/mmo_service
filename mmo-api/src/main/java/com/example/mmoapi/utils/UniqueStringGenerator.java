package com.example.mmoapi.utils;

import java.util.UUID;

public class UniqueStringGenerator {
    public static String generateUniqueString(int length) {
        return UUID.randomUUID().toString().replace("-", "").substring(0, length);
    }
}
