package com.dlk.ecommerce.service.Impl;

import com.dlk.ecommerce.service.BaseRedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BaseRedisServiceImpl<K, F, V> implements BaseRedisService<K, F, V> {
    private final RedisTemplate<K, V> redisTemplate;
    private final HashOperations<K, String, V> hashOperations;

    @Override
    public void set(K key, V value) {
        redisTemplate.opsForValue().set(key, value);
    }

    @Override
    public void setTimeToLive(K key, Long timeoutInSeconds) {
        redisTemplate.expire(key, timeoutInSeconds, TimeUnit.SECONDS);
    }

    @Override
    public void hashSet(K key, F field, V value) {
        hashOperations.put(key, field.toString(), value);
    }

    @Override
    public boolean hashExists(K key, F field) {
        return hashOperations.hasKey(key, field.toString());
    }

    @Override
    public boolean isMemberSet(K key, V value) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(key, value));
    }

    @Override
    public V get(K key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public Map<String, V> getFields(K key) {
        return hashOperations.entries(key);
    }

    @Override
    public V hashGet(K key, F field) {
        return hashOperations.get(key, field.toString());
    }

    @Override
    public List<Object> hashGetByFieldPrefix(K key, String fieldPrefix) {
        return  hashOperations.entries(key).entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(fieldPrefix.toString()))
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());
    }

    @Override
    public Set<String> getFieldPrefixes(K key) {
        return hashOperations.keys(key);
    }

    @Override
    public void delete(K key) {
        redisTemplate.delete(key);
    }

    @Override
    public void deleteField(K key, F field) {
        hashOperations.delete(key, field.toString());
    }

    @Override
    public void delete(K key, List<F> fields) {
        fields.forEach(field -> hashOperations.delete(key, field.toString()));
    }
}
