import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
// Если есть пароль: redis://:PASSWORD@127.0.0.1:6379
const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 10000,
    // дополнительные опции reconnectStrategy, lazyConnect и т.д.
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error", err));

// Пример: установка state с TTL (для состояния диалога)
export async function setState(userId, stateObj, ttlSeconds = 600) {
    const key = `state:${userId}`;
    await redis.set(key, JSON.stringify(stateObj), "EX", ttlSeconds);
}

export async function getState(userId) {
    const key = `state:${userId}`;
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : null;
}

// Использование
// await setState("79001234567", { intent: "adding_event", step: "ask_day" }, 600);
// const s = await getState("79001234567");
// console.log(s);
