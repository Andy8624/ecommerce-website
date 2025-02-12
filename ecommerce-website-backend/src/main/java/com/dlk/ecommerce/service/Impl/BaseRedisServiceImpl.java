package com.dlk.ecommerce.service.Impl;

import com.dlk.ecommerce.service.BaseRedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
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
    private final ZSetOperations<K, V> zSetOperations;

    /** ========================== Value Operations ========================== */

    @Override
    public void set(K key, V value) {
        redisTemplate.opsForValue().set(key, value);
    }

    @Override
    public V get(K key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public boolean hasKey(K Key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(Key));
    }

    @Override
    public void setTimeToLive(K key, Long timeoutInSeconds) {
        redisTemplate.expire(key, timeoutInSeconds, TimeUnit.SECONDS);
    }

    @Override
    public Long getTimeToLive(K key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    @Override
    public void delete(K key) {
        redisTemplate.delete(key);
    }

    /** ========================== Hash Operations ========================== */

    @Override
    public void hashSet(K key, F field, V value) {
        hashOperations.put(key, field.toString(), value);
    }

    @Override
    public boolean hashExists(K key, F field) {
        return hashOperations.hasKey(key, field.toString());
    }

    @Override
    public V hashGet(K key, F field) {
        return hashOperations.get(key, field.toString());
    }

    @Override
    public Map<String, V> getFields(K key) {
        return hashOperations.entries(key);
    }

    @Override
    public List<Object> hashGetByFieldPrefix(K key, String fieldPrefix) {
        return hashOperations.entries(key).entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(fieldPrefix))
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());
    }

    @Override
    public Set<String> getFieldPrefixes(K key) {
        return hashOperations.keys(key).stream()
                .map(field -> field.contains(":") ? field.split(":")[0] : field)
                .collect(Collectors.toSet());
    }

    @Override
    public void deleteField(K key, F field) {
        hashOperations.delete(key, field.toString());
    }

    @Override
    public void delete(K key, List<F> fields) {
        fields.forEach(field -> hashOperations.delete(key, field.toString()));
    }

    /** ========================== Set Operations ========================== */

    @Override
    public void addToSet(K key, V value) {
        redisTemplate.opsForSet().add(key, value);
    }

    @Override
    public void removeFromSet(K key, V value) {
        redisTemplate.opsForSet().remove(key, value);
    }

    @Override
    public Set<V> getSetMembers(K key) {
        return redisTemplate.opsForSet().members(key);
    }

    @Override
    public boolean isMemberSet(K key, V value) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(key, value));
    }

    /** ========================== Sorted Set (ZSet) Operations ========================== */

    @Override
    public void addToSortedSet(K key, V value, double score) {
        zSetOperations.add(key, value, score);
    }

    @Override
    public void removeFromSortedSet(K key, V value) {
        zSetOperations.remove(key, value);
    }

    @Override
    public Set<V> getSortedSetRange(K key, long start, long end) {
        return zSetOperations.range(key, start, end);
    }

    @Override
    public Double getSortedSetScore(K key, V value) {
        return zSetOperations.score(key, value);
    }

    @Override
    public void incrementSortedSetScore(K key, V value, double delta) {
        zSetOperations.incrementScore(key, value, delta);
    }

    /** ========================== List Operations ========================== */

    @Override
    public void addToList(K key, V value) {
        redisTemplate.opsForList().leftPush(key, value); // LPUSH: Thêm vào đầu danh sách
    }

    @Override
    public void addToListTail(K key, V value) {
        redisTemplate.opsForList().rightPush(key, value); // RPUSH: Thêm vào cuối danh sách
    }

    @Override
    public List<V> getListRange(K key, long start, long end) {
        return redisTemplate.opsForList().range(key, start, end); // LRANGE: Lấy danh sách theo phạm vi
    }

    @Override
    public void trimList(K key, long start, long end) {
        redisTemplate.opsForList().trim(key, start, end); // LTRIM: Cắt danh sách theo giới hạn
    }

    @Override
    public void removeFromList(K key, V value, int count) {
        redisTemplate.opsForList().remove(key, count, value); // LREM: Xóa phần tử theo giá trị và số lần xuất hiện
    }

    @Override
    public int getListSize(K key) {
        Long size = redisTemplate.opsForList().size(key); // LLEN: Lấy kích thước danh sách
        return (size != null) ? size.intValue() : 0;
    }

    @Override
    public V getListElementAt(K key, long index) {
        return redisTemplate.opsForList().index(key, index); // LINDEX: Lấy phần tử tại vị trí cụ thể
    }

    @Override
    public void updateListElementAt(K key, long index, V value) {
        redisTemplate.opsForList().set(key, index, value); // LSET: Cập nhật phần tử tại vị trí cụ thể
    }

    @Override
    public V popFromListHead(K key) {
        return redisTemplate.opsForList().leftPop(key); // LPOP: Lấy và xóa phần tử đầu danh sách
    }

    @Override
    public V popFromListTail(K key) {
        return redisTemplate.opsForList().rightPop(key); // RPOP: Lấy và xóa phần tử cuối danh sách
    }
}
