/**
 * Centralized analytics event definitions for ShopSphere
 */

// Page view events
export const PAGE_VIEW_EVENTS = {
  HOME: 'home_viewed',
  PRODUCT_LIST: 'product_list_viewed',
  PRODUCT_DETAIL: 'product_detail_viewed',
  CART: 'cart_viewed',
  CHECKOUT: 'checkout_viewed',
  ORDER_CONFIRMATION: 'order_confirmation_viewed',
  ORDER_HISTORY: 'order_history_viewed',
  PROFILE: 'profile_viewed',
  LOGIN: 'login_viewed',
  REGISTER: 'register_viewed',
} as const;

// E-commerce events
export const ECOMMERCE_EVENTS = {
  PRODUCT_SEARCH: 'product_searched',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  PRODUCT_REMOVED_FROM_CART: 'product_removed_from_cart',
  CART_CLEARED: 'cart_cleared',
  WISHLIST_ADDED: 'product_added_to_wishlist',
  WISHLIST_REMOVED: 'product_removed_from_wishlist',
  COUPON_APPLIED: 'coupon_applied',
  COUPON_REJECTED: 'coupon_rejected',
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_STEP_COMPLETED: 'checkout_step_completed',
  ORDER_COMPLETED: 'order_completed',
  ORDER_CANCELLED: 'order_cancelled',
  RETURN_REQUESTED: 'return_requested',
  PRODUCT_REVIEWED: 'product_reviewed',
  QUESTION_ASKED: 'product_question_asked',
  ADDRESS_ADDED: 'address_added',
  PAYMENT_METHOD_ADDED: 'payment_method_added',
} as const;

// UI interaction events
export const UI_EVENTS = {
  CTA_CLICKED: 'cta_clicked',
  NAVIGATION_CLICKED: 'navigation_clicked',
  FILTER_APPLIED: 'filter_applied',
  SORT_CHANGED: 'sort_changed',
  TAB_CHANGED: 'tab_changed',
  MODAL_OPENED: 'modal_opened',
  MODAL_CLOSED: 'modal_closed',
  TOAST_DISPLAYED: 'toast_displayed',
} as const;

// Authentication events
export const AUTH_EVENTS = {
  SIGN_UP: 'sign_up',
  SIGN_IN: 'sign_in',
  SIGN_OUT: 'sign_out',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  EMAIL_VERIFIED: 'email_verified',
  OAUTH_LOGIN: 'oauth_login',
} as const;

// Export all events
export const ANALYTICS_EVENTS = {
  ...PAGE_VIEW_EVENTS,
  ...ECOMMERCE_EVENTS,
  ...UI_EVENTS,
  ...AUTH_EVENTS,
};

// Type for event names
export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];