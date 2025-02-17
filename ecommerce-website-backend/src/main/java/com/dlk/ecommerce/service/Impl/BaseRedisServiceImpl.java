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
public class BaseRedisServiceImpl implements BaseRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final HashOperations<String, String, Object> hashOperations;
    private final ZSetOperations<String, Object> zSetOperations;

    /** ========================== Value Operations ========================== */

    @Override
    public void set(String key, Object value) {
        redisTemplate.opsForValue().set(key, value);
    }

    @Override
    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public boolean hasKey(String key) {
        Boolean result = redisTemplate.hasKey(key);
        return result != null && result;
    }

    @Override
    public void setTimeToLive(String key, Long timeoutInSeconds) {
        redisTemplate.expire(key, timeoutInSeconds, TimeUnit.SECONDS);
    }

    @Override
    public Long getTimeToLive(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    @Override
    public void delete(String key) {
        redisTemplate.delete(key);
    }

    /** ========================== Hash Operations ========================== */

    @Override
    public void hashSet(String key, String field, Object value) {
        hashOperations.put(key, field, value);
    }

    @Override
    public boolean hashExists(String key, String field) {
        return hashOperations.hasKey(key, field);
    }

    @Override
    public Object hashGet(String key, String field) {
        return hashOperations.get(key, field);
    }

    @Override
    public Map<String, Object> getFields(String key) {
        return hashOperations.entries(key);
    }

    @Override
    public List<Object> hashGetByFieldPrefix(String key, String fieldPrefix) {
        return hashOperations.entries(key).entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(fieldPrefix))
                .map(Map.Entry::getValue)
                .collect(Collectors.toList());
    }

    @Override
    public Set<String> getFieldPrefixes(String key) {
        return hashOperations.keys(key).stream()
                .map(field -> field.contains(":") ? field.split(":")[0] : field)
                .collect(Collectors.toSet());
    }

    @Override
    public void deleteField(String key, String field) {
        hashOperations.delete(key, field);
    }

    @Override
    public void delete(String key, List<String> fields) {
        fields.forEach(field -> hashOperations.delete(key, field));
    }


    /** ========================== Set Operations ========================== */

    @Override
    public void addToSet(String key, Object value) {
        redisTemplate.opsForSet().add(key, value);
    }

    @Override
    public void removeFromSet(String key, Object value) {
        redisTemplate.opsForSet().remove(key, value);
    }

    @Override
    public Set<Object> getSetMembers(String key) {
        return redisTemplate.opsForSet().members(key);
    }

    @Override
    public boolean isMemberSet(String key, Object value) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(key, value));
    }


    /** ========================== Sorted Set (ZSet) Operations ========================== */

    @Override
    public void addToSortedSet(String key, Object value, double score) {
        zSetOperations.add(key, value, score);
    }

    @Override
    public void removeFromSortedSet(String key, Object value) {
        zSetOperations.remove(key, value);
    }

    @Override
    public Set<Object> getSortedSetRange(String key, long start, long end) {
        return zSetOperations.range(key, start, end);
    }

    @Override
    public Double getSortedSetScore(String key, Object value) {
        return zSetOperations.score(key, value);
    }

    @Override
    public void incrementSortedSetScore(String key, Object value, double delta) {
        zSetOperations.incrementScore(key, value, delta);
    }

    /** ========================== List Operations ========================== */

    @Override
    public void addToList(String key, Object value) {
        redisTemplate.opsForList().leftPush(key, value); // LPUSH: Thêm vào đầu danh sách
    }

    @Override
    public void addToListTail(String key, Object value) {
        redisTemplate.opsForList().rightPush(key, value); // RPUSH: Thêm vào cuối danh sách
    }

    @Override
    public List<Object> getListRange(String key, long start, long end) {
        return redisTemplate.opsForList().range(key, start, end); // LRANGE: Lấy danh sách theo phạm vi
    }

    @Override
    public void trimList(String key, long start, long end) {
        redisTemplate.opsForList().trim(key, start, end); // LTRIM: Cắt danh sách theo giới hạn
    }

    @Override
    public void removeFromList(String key, Object value, int count) {
        redisTemplate.opsForList().remove(key, count, value); // LREM: Xóa phần tử theo giá trị và số lần xuất hiện
    }

    @Override
    public int getListSize(String key) {
        Long size = redisTemplate.opsForList().size(key); // LLEN: Lấy kích thước danh sách
        return (size != null) ? size.intValue() : 0;
    }

    @Override
    public Object getListElementAt(String key, long index) {
        return redisTemplate.opsForList().index(key, index); // LINDEX: Lấy phần tử tại vị trí cụ thể
    }

    @Override
    public void updateListElementAt(String key, long index, Object value) {
        redisTemplate.opsForList().set(key, index, value); // LSET: Cập nhật phần tử tại vị trí cụ thể
    }

    @Override
    public Object popFromListHead(String key) {
        return redisTemplate.opsForList().leftPop(key); // LPOP: Lấy và xóa phần tử đầu danh sách
    }

    @Override
    public Object popFromListTail(String key) {
        return redisTemplate.opsForList().rightPop(key); // RPOP: Lấy và xóa phần tử cuối danh sách
    }
}
