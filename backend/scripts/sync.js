// This is a one-time script to populate Elasticsearch with denormalized data from MySQL.

const dbPool = require('../config/db');

const esClient = require('../config/esClient')
const indexName = 'tickets';

async function syncData() {
    try {
        console.log('Starting data sync from MySQL to Elasticsearch...');

        // 1. Delete old index if it exists
        if (await esClient.indices.exists({ index: indexName })) {
            console.log(`Deleting existing index: ${indexName}`);
            await esClient.indices.delete({ index: indexName });
        }

        // 2. Create new index with proper mapping
        console.log(`Creating new index: ${indexName}`);
        await esClient.indices.create({
            index: indexName,
            body: {
                mappings: {
                    properties: {
                        id: { type: 'integer' },
                        departure_date: { type: 'date' },
                        source: { type: 'keyword' },
                        destination: { type: 'keyword' },
                        vehicle_type: { type: 'keyword' },
                        price: { type: 'integer' },
                        remaining_cap: { type: 'integer' },
                        company_name: { type: 'text' },
                        class_name: { type: 'keyword' }
                    }
                }
            }
        });

        // 3. Fetch Company and Class data to create lookup maps
        const [companies] = await dbPool.query('SELECT * FROM Company');
        const companyMap = new Map(companies.map(c => [c.id, c.name]));

        const [classes] = await dbPool.query('SELECT * FROM Class');
        const classMap = new Map(classes.map(cl => [cl.id, cl.name]));

        // 4. Fetch all tickets from MySQL
        console.log('Fetching tickets from MySQL...');
        const [tickets] = await dbPool.query('SELECT * FROM Ticket');

        if (tickets.length === 0) {
            console.log('No tickets found in MySQL to sync.');
            return;
        }

        // 5. Prepare the data for bulk insert, enriching it with company/class names
        const body = tickets.flatMap(ticket => {
            const enrichedTicket = {
                ...ticket,
                company_name: companyMap.get(ticket.company_id) || 'Unknown',
                class_name: classMap.get(ticket.class_id) || 'Unknown'
            };
            // Remove original ID fields to avoid confusion
            delete enrichedTicket.company_id;
            delete enrichedTicket.class_id;

            return [{ index: { _index: indexName, _id: ticket.id } }, enrichedTicket];
        });

        // 6. Perform the bulk insert
        console.log(`Indexing ${tickets.length} documents...`);
        await esClient.bulk({ refresh: true, body });

        console.log('✅ Sync complete!');

    } catch (error) {
        console.error('❌ An error occurred during the sync process:', error.meta?.body || error);
    } finally {
        await dbPool.end();
    }
}

syncData();
