import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductDetailPage() {
  const product = {
    id: '1',
    title: 'Wireless Noise-Cancelling Headphones',
    price: 199.99,
    discountedPrice: 149.99,
    images: [
      'https://via.placeholder.com/600x600?text=Headphones+Front',
      'https://via.placeholder.com/600x600?text=Headphones+Side',
      'https://via.placeholder.com/600x600?text=Headphones+Back',
    ],
    rating: 4.7,
    reviews: 124,
    description:
      'Experience immersive sound with our premium wireless headphones. Active noise cancellation, 30-hour battery life, and ultra-comfortable fit.',
    brand: 'AudioPro',
    category: 'Electronics',
    inStock: true,
    variants: [
      { color: 'Black', inStock: true },
      { color: 'Silver', inStock: true },
      { color: 'Rose Gold', inStock: false },
    ],
  };

  const frequentlyBoughtTogether = [
    {
      id: '2',
      title: 'Premium Audio Cable',
      price: 29.99,
      image: 'https://via.placeholder.com/150x150?text=Cable',
    },
    {
      id: '3',
      title: 'Leather Carrying Case',
      price: 39.99,
      image: 'https://via.placeholder.com/150x150?text=Case',
    },
  ];

  const reviews = [
    {
      id: '1',
      user: 'Alex M.',
      rating: 5,
      title: 'Outstanding sound quality!',
      comment: 'These headphones deliver crystal clear audio and the noise cancellation is incredible.',
      date: '2024-01-15',
    },
    {
      id: '2',
      user: 'Jamie L.',
      rating: 4,
      title: 'Great value for money',
      comment: 'Comfortable to wear for long periods and battery lasts as advertised.',
      date: '2024-01-10',
    },
  ];

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
            <div className="flex gap-2 mt-4">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  className="w-20 h-20 object-cover border border-gray-200 rounded cursor-pointer hover:border-orange-500"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <div className="flex items-center mb-4">
              <div className="flex text-orange-500">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.reviews} reviews
              </span>
            </div>

            <div className="flex items-center mb-6">
              <span className="font-bold text-2xl text-gray-900">
                ${product.discountedPrice}
              </span>
              <span className="text-lg text-gray-500 line-through ml-2">
                ${product.price}
              </span>
              <span className="ml-4 bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                Save ${(product.price - product.discountedPrice).toFixed(2)}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    disabled={!variant.inStock}
                    className={`px-4 py-2 rounded-md border text-sm font-medium transition ${
                      variant.inStock
                        ? 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <label className="text-sm font-medium text-gray-700 mr-4">
                Quantity:
              </label>
              <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 mb-6">
              <Button size="lg" className="flex-1">
                Add to Cart
              </Button>
              <Button size="lg" variant="secondary">
                Buy Now
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <p>Free delivery: Arrives Tue, Jan 21</p>
              <p>Secure transaction</p>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Bought Together
          </h2>
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4 flex-1">
              {frequentlyBoughtTogether.map((item) => (
                <div key={item.id} className="text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-700">{item.title}</p>
                  <p className="font-medium text-gray-900">${item.price}</p>
                </div>
              ))}
            </div>
            <div className="ml-8 text-right">
              <p className="text-sm text-gray-600">Total Price:</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {(product.discountedPrice + 29.99 + 39.99).toLocaleString(
                  'en-US',
                  {
                    minimumFractionDigits: 2,
                  }
                )}
              </p>
              <Button size="sm" className="mt-2">
                Add All to Cart
              </Button>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <Tabs defaultValue="reviews" className="mt-16">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Brand:</strong> {product.brand}
              </li>
              <li>
                <strong>Category:</strong> {product.category}
              </li>
              <li>
                <strong>Connectivity:</strong> Bluetooth 5.0, 3.5mm jack
              </li>
              <li>
                <strong>Battery Life:</strong> Up to 30 hours
              </li>
              <li>
                <strong>Weight:</strong> 250g
              </li>
            </ul>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {review.user} • {review.date}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900">{review.title}</h4>
                  <p className="text-gray-700 mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-6">
              Write a Review
            </Button>
          </TabsContent>
          <TabsContent value="qa" className="mt-6">
            <p className="text-gray-600">
              No questions yet. Be the first to ask a question.
            </p>
            <Button variant="outline" className="mt-4">
              Ask a Question
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}