package com.dlk.ecommerce.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class RecommendationService {

    private final StringRedisTemplate redisTemplate;
    private final RestTemplate restTemplate;

    public RecommendationService(StringRedisTemplate redisTemplate, RestTemplate restTemplate) {
        this.redisTemplate = redisTemplate;
        this.restTemplate = restTemplate;
    }

    public List<String> getRecommendations(String userId) {
        String cacheKey = "recommendations:" + userId;
        String cachedRecommendations = redisTemplate.opsForValue().get(cacheKey);

        if (cachedRecommendations != null) {
            System.out.println("Fetching from Redis Cache...");
            return List.of(cachedRecommendations.split(","));
        }

        System.out.println("Fetching from Python API...");
        String url = "http://python-recommender:5000/api/recommendations?userId=" + userId;
        String recommendations = restTemplate.getForObject(url, String.class);

        if (recommendations != null) {
            redisTemplate.opsForValue().set(cacheKey, recommendations);
        }

        return List.of(recommendations.split(","));
    }
}
