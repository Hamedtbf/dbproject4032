const { Client } = require('@elastic/elasticsearch');

// Create and export a single, shared Elasticsearch client instance
const esClient = new Client({ node: 'http://localhost:9200' });

module.exports = esClient;
