import { getAuthToken } from './auth';

const API_BASE = '/api';

/**
 * Fetches products with optional filters
 * @param {Object} params - Filter parameters
 * @returns {Promise<Array>} - Array of products
 */
export async function getProducts(params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_BASE}/products${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

/**
 * Fetches a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Product object
 */
export async function getProduct(id) {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

/**
 * Adds an item to the user's cart
 * @param {Object} item - Item to add to cart
 * @param {string} item.productId - Product ID
 * @param {number} item.quantity - Quantity to add
 * @param {Object} item.variant - Selected variant (optional)
 * @returns {Promise<Object>} - Updated cart
 */
export async function addToCart(item) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(item)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add to cart');
  }

  return response.json();
}

/**
 * Gets the user's cart
 * @returns {Promise<Object>} - Cart object
 */
export async function getCart() {
  const token = getAuthToken();
  if (!token) {
    return { items: [] };
  }

  const response = await fetch(`${API_BASE}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      return { items: [] };
    }
    throw new Error('Failed to fetch cart');
  }

  return response.json();
}

/**
 * Removes an item from the user's cart
 * @param {string} productId - Product ID to remove
 * @returns {Promise<Object>} - Updated cart
 */
export async function removeFromCart(productId) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to remove from cart');
  }

  return response.json();
}

/**
 * Updates the quantity of an item in the cart
 * @param {string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} - Updated cart
 */
export async function updateCartItem(productId, quantity) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ quantity })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update cart item');
  }

  return response.json();
}

/**
 * Creates a Stripe Checkout Session
 * @param {string} successUrl - URL to redirect to after successful payment
 * @param {string} cancelUrl - URL to redirect to after cancelled payment
 * @returns {Promise<Object>} - Stripe session object
 */
export async function createCheckoutSession(successUrl, cancelUrl) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE}/payment/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ successUrl, cancelUrl })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
}

/**
 * Gets the current user's profile
 * @returns {Promise<Object>} - User profile
 */
export async function getUserProfile() {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
}