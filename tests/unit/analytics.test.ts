import { describe, it, expect, vi } from 'vitest';
import { analytics } from '../../client/src/lib/analytics';

// Mock PostHog
vi.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn(),
  },
}));

// Mock window.doNotTrack
Object.defineProperty(window, 'doNotTrack', {
  value: '0',
  writable: true,
});

describe('AnalyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset analytics instance
    Object.assign(analytics, new (require('../../client/src/lib/analytics').AnalyticsService)());
  });

  it('initializes with PostHog when available', () => {
    // Mock window.posthog
    window.posthog = {
      init: vi.fn(),
      capture: vi.fn(),
      identify: vi.fn(),
      reset: vi.fn(),
    };

    // Trigger initialization
    analytics.track('test-event');

    expect(window.posthog.init).toHaveBeenCalled();
    expect(analytics.isInitialized).toBe(true);
  });

  it('queues events when PostHog is not available', () => {
    // Ensure PostHog is not available
    const originalPostHog = window.posthog;
    window.posthog = undefined;

    analytics.track('test-event', { value: 123 });

    expect(analytics.queue).toHaveLength(1);
    expect(analytics.queue[0]).toEqual({
      event: 'test-event',
      properties: { value: 123 },
    });

    // Restore PostHog
    window.posthog = originalPostHog;
  });

  it('flushes queued events when initialized', () => {
    // Ensure PostHog is not available
    const originalPostHog = window.posthog;
    window.posthog = undefined;

    // Queue some events
    analytics.track('event-1');
    analytics.track('event-2');

    // Initialize PostHog
    window.posthog = {
      init: vi.fn(),
      capture: vi.fn(),
      identify: vi.fn(),
      reset: vi.fn(),
    };

    // Trigger initialization
    analytics.track('event-3');

    expect(window.posthog.capture).toHaveBeenCalledTimes(3);
    expect(window.posthog.capture).toHaveBeenCalledWith('event-1', undefined);
    expect(window.posthog.capture).toHaveBeenCalledWith('event-2', undefined);
    expect(window.posthog.capture).toHaveBeenCalledWith('event-3', undefined);
    expect(analytics.queue).toHaveLength(0);

    // Restore PostHog
    window.posthog = originalPostHog;
  });

  it('tracks page view with enhanced context', () => {
    window.posthog = {
      init: vi.fn(),
      capture: vi.fn(),
      identify: vi.fn(),
      reset: vi.fn(),
    };

    analytics.trackPageView('/home', 'Home Page');

    expect(window.posthog.capture).toHaveBeenCalledWith('$pageview', {
      path: '/home',
      title: 'Home Page',
      referrer: '',
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      device_type: expect.any(String),
    });
  });

  it('identifies user with traits', () => {
    window.posthog = {
      init: vi.fn(),
      capture: vi.fn(),
      identify: vi.fn(),
      reset: vi.fn(),
    };

    analytics.identify('user-123', { email: 'user@example.com' });

    expect(window.posthog.identify).toHaveBeenCalledWith('user-123', { email: 'user@example.com' });
  });

  it('respects Do Not Track setting', () => {
    // Set DNT to enabled
    Object.defineProperty(window, 'doNotTrack', {
      value: '1',
    });

    window.posthog = {
      init: vi.fn(),
      capture: vi.fn(),
      identify: vi.fn(),
      reset: vi.fn(),
    };

    analytics.track('test-event');

    expect(window.posthog.init).not.toHaveBeenCalled();
    expect(window.posthog.capture).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Analytics disabled: Do Not Track is enabled');
  });
});