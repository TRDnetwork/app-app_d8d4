import { SearchClient, SearchIndex } from 'algoliasearch';
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  ALGOLIA_APP_ID: str(),
  ALGOLIA_ADMIN_KEY: str(),
  ALGOLIA_SEARCH_KEY: str(),
  ALGOLIA_INDEX_NAME: str(),
});

const client = SearchClient(env.ALGOLIA_APP_ID, env.ALGOLIA_ADMIN_KEY);
const index = client.initIndex(env.ALGOLIA_INDEX_NAME);

export const searchProducts = async (query: string, filters?: string) => {
  return await index.search(query, {
    filters,
    hitsPerPage: 20,
    attributesToRetrieve: [
      'objectID',
      'title',
      'description',
      'price',
      'original_price',
      'discount_percent',
      'images',
      'brand',
      'category',
      'avg_rating',
      'review_count',
    ],
    attributesToHighlight: ['title', 'description'],
  });
};

export const getSuggestions = async (query: string) => {
  const response = await index.search(query, {
    hitsPerPage: 5,
    attributesToRetrieve: ['title'],
  });

  return response.hits.map((hit: any) => hit.title);
};

export const indexProduct = async (product: any) => {
  const record = {
    objectID: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    original_price: product.original_price,
    discount_percent: product.discount_percent,
    images: product.images,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    tags: product.tags,
    avg_rating: product.avg_rating,
    review_count: product.review_count,
    status: product.status,
    created_at: product.created_at.getTime(),
  };

  await index.saveObject(record);
};

export const removeProductFromIndex = async (productId: string) => {
  await index.deleteObject(productId);
};