package com.dlk.ecommerce.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

public interface BaseRedisService<K, F, V> {
    void set(K key, V value);

    void setTimeToLive(K key, Long timeoutInSeconds);

    void hashSet(K key, F field, V value);

    boolean hashExists(K key, F field);

    boolean isMemberSet(K key, V value);

    Object get(K key);

    Map<String, V> getFields(K key);

    Object hashGet(K key, F field);

    List<Object> hashGetByFieldPrefix(K key, String fieldPrefix);

    Set<String> getFieldPrefixes(K key);

    void delete(K key);

    void deleteField(K key, F field);

    void delete(K key, List<F> fields);
}
