// Enhanced analytics tracking for ShopSphere e-commerce platform
// Handles event tracking while respecting user privacy and DNT

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

class AnalyticsService {
  private queue: AnalyticsEvent[] = [];
  private isInitialized = false;
  private batchSize = 5;
  private flushInterval = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Don't initialize if DNT is enabled
    if (navigator.doNotTrack === '1') {
      console.log('Analytics disabled: Do Not Track is enabled');
      return;
    }

    // Check if PostHog is available
    if (window.posthog) {
      this.isInitialized = true;
      this.flush(); // Send any queued events
      this.startPeriodicFlush();
    } else {
      console.log('PostHog not loaded, queuing events');
    }
  }

  private startPeriodicFlush() {
    if (this.flushTimer) return;
    
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private flush() {
    if (!this.queue.length || !this.isInitialized) return;

    // Process events in batches
    const batch = this.queue.splice(0, this.batchSize);
    batch.forEach(event => this.trackEvent(event));
  }

  private trackEvent(event: AnalyticsEvent) {
    try {
      if (window.posthog) {
        window.posthog.capture(event.event, event.properties);
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      // Re-queue failed events
      this.queue.unshift(event);
    }
  }

  track(event: string, properties?: Record<string, any>) {
    const eventObj = { event, properties };
    
    if (this.isInitialized) {
      this.trackEvent(eventObj);
    } else {
      this.queue.push(eventObj);
    }
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (this.isInitialized && window.posthog) {
      window.posthog.identify(userId, traits);
    }
  }

  reset() {
    if (this.isInitialized && window.posthog) {
      window.posthog.reset();
    }
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  // Page view tracking with enhanced context
  trackPageView(path: string, title: string) {
    this.track('$pageview', {
      path,
      title,
      referrer: document.referrer,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      device_type: this.getDeviceType()
    });
  }

  private getDeviceType(): string {
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
}

// Global analytics instance
export const analytics = new AnalyticsService();

// Cleanup on page hide
window.addEventListener('pagehide', () => {
  analytics.flush();
  analytics.reset();
});