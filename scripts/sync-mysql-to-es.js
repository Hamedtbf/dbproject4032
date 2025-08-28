// This is a one-time script to populate Elasticsearch with data from MySQL.

const { Client } = require('@elastic/elasticsearch');
const dbPool = require('../config/db');

// Configure the Elasticsearch client
const esClient = new Client({ node: 'http://localhost:9200' });
const indexName = 'tickets';

async function syncData() {
    try {
        console.log('Starting data sync from MySQL to Elasticsearch...');

        // 1. Check if the index exists. If so, delete it to start fresh.
        const indexExists = await esClient.indices.exists({ index: indexName });
        if (indexExists) {
            console.log(`Deleting existing index: ${indexName}`);
            await esClient.indices.delete({ index: indexName });
        }

        // 2. Create a new index with a specific mapping.
        console.log(`Creating new index: ${indexName}`);
        await esClient.indices.create({
            index: indexName,
            body: {
                mappings: {
                    properties: {
                        departure_date: { type: 'date' },
                        source: { type: 'keyword' },
                        destination: { type: 'keyword' },
                        vehicle_type: { type: 'keyword' },
                        price: { type: 'integer' },
                        remaining_cap: { type: 'integer' }
                    }
                }
            }
        });

        // 3. Fetch all relevant ticket data from MySQL.
        console.log('Fetching tickets from MySQL...');
        const [tickets] = await dbPool.query(`
            SELECT 
                T.id, T.vehicle_type, T.source, T.destination, 
                T.departure_date, T.departure_time, T.price, T.remaining_cap,
                C.name as company_name, CL.name as class_name
            FROM Ticket T 
            JOIN Company C ON T.company_id = C.id 
            JOIN Class CL ON T.class_id = CL.id
        `);

        if (tickets.length === 0) {
            console.log('No tickets found in MySQL to sync.');
            return;
        }

        // 4. Prepare the data for a bulk insert into Elasticsearch.
        const body = tickets.flatMap(doc => [{ index: { _index: indexName, _id: doc.id } }, doc]);

        // 5. Perform the bulk insert.
        console.log(`Indexing ${tickets.length} documents...`);
        const bulkResponse = await esClient.bulk({ refresh: true, body });

        if (bulkResponse.errors) {
            console.error('Bulk indexing had errors:', bulkResponse.items);
        } else {
            console.log('Successfully indexed all documents.');
        }

        console.log('Sync complete!');

    } catch (error) {
        console.error('An error occurred during the sync process:', error);
    } finally {
        // Close the database connection
        await dbPool.end();
    }
}

syncData();
