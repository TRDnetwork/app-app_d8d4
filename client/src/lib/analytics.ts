/**
 * Analytics service for ShopSphere e-commerce application
 * Uses PostHog for event tracking with privacy considerations
 */

interface EventProperties {
  [key: string]: any;
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Initialize the analytics service
   * Should be called once when the app starts
   */
  public init(): void {
    // Check for Do Not Track
    if (this.isDoNotTrackEnabled()) {
      console.log('Analytics disabled due to Do Not Track setting');
      return;
    }

    this.isInitialized = true;
  }

  /**
   * Check if Do Not Track is enabled
   */
  private isDoNotTrackEnabled(): boolean {
    return (
      navigator.doNotTrack === '1' ||
      window.doNotTrack === '1' ||
      navigator.doNotTrack === 'yes'
    );
  }

  /**
   * Track a custom event
   */
  public track(event: string, properties?: EventProperties): void {
    if (!this.isInitialized || this.isDoNotTrackEnabled()) {
      return;
    }

    try {
      if (window.posthog) {
        window.posthog.push(['capture', event, properties]);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Identify a user for analytics
   */
  public identify(userId: string, properties?: EventProperties): void {
    if (!this.isInitialized || this.isDoNotTrackEnabled()) {
      return;
    }

    try {
      if (window.posthog) {
        window.posthog.push(['identify', userId]);
        if (properties) {
          window.posthog.push(['set', properties]);
        }
      }
    } catch (error) {
      console.error('Analytics identify error:', error);
    }
  }

  /**
   * Reset user identification
   */
  public reset(): void {
    if (!this.isInitialized || this.isDoNotTrackEnabled()) {
      return;
    }

    try {
      if (window.posthog) {
        window.posthog.push(['reset']);
      }
    } catch (error) {
      console.error('Analytics reset error:', error);
    }
  }
}

// Initialize the analytics service
const analytics = AnalyticsService.getInstance();
analytics.init();

export default analytics;