const sanityClient = require('@sanity/client');

const sanity = sanityClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    useCdn: true,
});

exports.handler = async () => {
    const query = '*[+type=="product"] | order(title asc)';
    try {
        const products = await sanity.fetch(query);
        return {
            statusCode: 200,
            body: JSON.stringify(products), // Return the fetched products as JSON
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
