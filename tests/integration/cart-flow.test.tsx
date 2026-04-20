
```
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useCartStore } from '../../src/stores/cartStore';
import { useAuthStore } from '../../src/stores/authStore';
import Cart from '../../src/pages/Cart';
import { cartApi } from '../../src/lib/api';

// Mock API calls
vi.mock('../../src/lib/api', () => ({
  cart