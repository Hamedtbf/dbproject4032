const redis = require('redis');
require('dotenv').config();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect();

module.exports = redisClient;
