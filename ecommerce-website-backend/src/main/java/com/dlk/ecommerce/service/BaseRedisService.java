package com.dlk.ecommerce.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Base interface for Redis operations, supporting Value, Hash, Set, and Sorted Set (ZSet) operations.
 *
 * @param <K> Type of Redis key
 * @param <F> Type of Hash field
 * @param <V> Type of value stored in Redis
 */
public interface BaseRedisService<K, F, V> {

    /** ========================== Value Operations ========================== */

    void set(K key, V value);
    Object get(K key);
    boolean hasKey(K key);
    void setTimeToLive(K key, Long timeoutInSeconds);
    Long getTimeToLive(K key);
    void delete(K key);

    /** ========================== Hash Operations ========================== */

    void hashSet(K key, F field, V value);
    boolean hashExists(K key, F field);
    Object hashGet(K key, F field);
    Map<String, V> getFields(K key);
    List<Object> hashGetByFieldPrefix(K key, String fieldPrefix);
    Set<String> getFieldPrefixes(K key);
    void deleteField(K key, F field);
    void delete(K key, List<F> fields);

    /** ========================== Set Operations ========================== */

    void addToSet(K key, V value);
    void removeFromSet(K key, V value);
    Set<V> getSetMembers(K key);
    boolean isMemberSet(K key, V value);

    /** ========================== Sorted Set (ZSet) Operations ========================== */

    void addToSortedSet(K key, V value, double score);
    void removeFromSortedSet(K key, V value);
    Set<V> getSortedSetRange(K key, long start, long end);
    Double getSortedSetScore(K key, V value);
    void incrementSortedSetScore(K key, V value, double delta);

    /** ========================== List Operations ========================== */

    void addToList(K key, V value);
    void addToListTail(K key, V value);
    List<V> getListRange(K key, long start, long end);
    void trimList(K key, long start, long end);
    void removeFromList(K key, V value, int count);
    int getListSize(K key);
    V getListElementAt(K key, long index);
    void updateListElementAt(K key, long index, V value);
    V popFromListHead(K key);
    V popFromListTail(K key);

}
