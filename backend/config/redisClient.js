const redis = require('redis');
require('dotenv').config();

// Create the Redis client instance
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Connect to Redis as soon as this file is loaded
redisClient.connect();

// Export the single, connected client
module.exports = redisClient;
