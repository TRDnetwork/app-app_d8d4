import React, { useEffect } from 'react';
import { useAuth } from '../stores/authStore';
import ProductCard from '../components/ProductCard';
import { apiClient } from '../lib/api';
import { Skeleton } from '../components/ui/skeleton';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient('/products?limit=8');
        setProducts(data.products);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome{user?.name ? `, ${user.name}` : ''}</h1>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-lg mb-8 overflow-hidden">
        <img
          src="https://via.placeholder.com/1200x300/1E293B/FF9900?text=Deals+of+the+Day"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Featured Products */}
      <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card">
              <div className="p-4">
                <Skeleton className="h-48 w-full shimmer" />
                <Skeleton className="h-6 w-3/4 mt-4 shimmer" />
                <Skeleton className="h-4 w-1/2 mt-2 shimmer" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;