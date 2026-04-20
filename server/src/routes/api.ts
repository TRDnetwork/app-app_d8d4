import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { authController } from '../controllers/authController';
import { userController } from '../controllers/userController';
import { productController } from '../controllers/productController';
import { cartController } from '../controllers/cartController';
import { orderController } from '../controllers/orderController';
import { reviewController } from '../controllers/reviewController';
import { searchController } from '../controllers/searchController';

const router = express.Router();

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authenticateToken, authController.refresh);
router.post('/auth/logout', authenticateToken, authController.logout);
router.post('/auth/verify-email', authController.verifyEmail);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/auth/oauth/google', authController.googleOAuth);
router.get('/auth/oauth/google/callback', authController.googleOAuthCallback);
router.get('/auth/oauth/facebook', authController.facebookOAuth);
router.get('/auth/oauth/facebook/callback', authController.facebookOAuthCallback);

// User routes
router.get('/users/profile', authenticateToken, userController.getProfile);
router.put('/users/profile', authenticateToken, userController.updateProfile);
router.put('/users/profile/picture', authenticateToken, userController.uploadPicture);
router.get('/users/addresses', authenticateToken, userController.getAddresses);
router.post('/users/addresses', authenticateToken, userController.addAddress);
router.put('/users/addresses/:id', authenticateToken, userController.updateAddress);
router.delete('/users/addresses/:id', authenticateToken, userController.deleteAddress);

// Product routes
router.get('/products', productController.getProducts);
router.get('/products/:slug', productController.getProductBySlug);
router.get('/products/:id/reviews', productController.getReviews);
router.get('/products/:id/questions', productController.getQuestions);
router.post('/products/:id/questions', authenticateToken, productController.askQuestion);
router.put('/products/questions/:id/answer', authenticateToken, productController.answerQuestion);
router.get('/products/recently-viewed', authenticateToken, productController.getRecentlyViewed);
router.get('/products/recommendations', authenticateToken, productController.getRecommendations);

// Cart routes
router.get('/cart', authenticateToken, cartController.getCart);
router.post('/cart/items', authenticateToken, cartController.addItem);
router.put('/cart/items/:id', authenticateToken, cartController.updateItem);
router.delete('/cart/items/:id', authenticateToken, cartController.removeItem);
router.post('/cart/apply-coupon', authenticateToken, cartController.applyCoupon);

// Wishlist routes
router.get('/wishlist', authenticateToken, userController.getWishlist);
router.post('/wishlist/:product_id', authenticateToken, userController.addToWishlist);
router.delete('/wishlist/:product_id', authenticateToken, userController.removeFromWishlist);

// Order routes
router.post('/orders', authenticateToken, orderController.createOrder);
router.get('/orders', authenticateToken, orderController.getOrders);
router.get('/orders/:id', authenticateToken, orderController.getOrderById);
router.put('/orders/:id/cancel', authenticateToken, orderController.cancelOrder);
router.post('/orders/:id/return', authenticateToken, orderController.requestReturn);
router.get('/orders/:id/invoice', authenticateToken, orderController.getInvoice);

// Review routes
router.post('/reviews', authenticateToken, reviewController.createReview);
router.put('/reviews/:id', authenticateToken, reviewController.updateReview);
router.delete('/reviews/:id', authenticateToken, reviewController.deleteReview);
router.post('/reviews/:id/helpful', authenticateToken, reviewController.markHelpful);

// Search routes
router.get('/search', searchController.search);
router.get('/search/suggest', searchController.suggest);

export default router;
```

```typescript
// SECURITY FIX: Add proper RLS policies for user-owned data