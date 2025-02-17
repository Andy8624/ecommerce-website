package com.dlk.ecommerce.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Base interface for Redis operations, supporting Value, Hash, Set, and Sorted Set (ZSet) operations.
 */
public interface BaseRedisService {

    /** ========================== Value Operations ========================== */

    void set(String key, Object value);
    Object get(String key);
    boolean hasKey(String key);
    void setTimeToLive(String key, Long timeoutInSeconds);
    Long getTimeToLive(String key);
    void delete(String key);

    /** ========================== Hash Operations ========================== */

    void hashSet(String key, String field, Object value);
    boolean hashExists(String key, String field);
    Object hashGet(String key, String field);
    Map<String, Object> getFields(String key);
    List<Object> hashGetByFieldPrefix(String key, String fieldPrefix);
    Set<String> getFieldPrefixes(String key);
    void deleteField(String key, String field);
    void delete(String key, List<String> fields);

    /** ========================== Set Operations ========================== */

    void addToSet(String key, Object value);
    void removeFromSet(String key, Object value);
    Set<Object> getSetMembers(String key);
    boolean isMemberSet(String key, Object value);

    /** ========================== Sorted Set (ZSet) Operations ========================== */

    void addToSortedSet(String key, Object value, double score);
    void removeFromSortedSet(String key, Object value);
    Set<Object> getSortedSetRange(String key, long start, long end);
    Double getSortedSetScore(String key, Object value);
    void incrementSortedSetScore(String key, Object value, double delta);

    /** ========================== List Operations ========================== */

    void addToList(String key, Object value);
    void addToListTail(String key, Object value);
    List<Object> getListRange(String key, long start, long end);
    void trimList(String key, long start, long end);
    void removeFromList(String key, Object value, int count);
    int getListSize(String key);
    Object getListElementAt(String key, long index);
    void updateListElementAt(String key, long index, Object value);
    Object popFromListHead(String key);
    Object popFromListTail(String key);
}
