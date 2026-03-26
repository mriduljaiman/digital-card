// Web Vitals tracking for performance monitoring

export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }

  // Send to analytics endpoint
  if (typeof window !== 'undefined') {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    // Use sendBeacon if available for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body);
    } else {
      fetch('/api/analytics/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(console.error);
    }
  }
}

// Performance monitoring utilities
export const performanceMonitor = {
  // Track custom events
  trackEvent(name: string, data?: Record<string, any>) {
    if (typeof window !== 'undefined' && window.performance) {
      performance.mark(name);
      console.log(`Performance Event: ${name}`, data);
    }
  },

  // Measure time between two marks
  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name, 'measure')[0];
        console.log(`Performance Measure: ${name} - ${measure.duration}ms`);
        return measure.duration;
      } catch (error) {
        console.error('Performance measure error:', error);
        return null;
      }
    }
    return null;
  },

  // Get navigation timing
  getNavigationTiming() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!navigation) return null;

      return {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domComplete - navigation.domInteractive,
        onLoad: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.fetchStart,
      };
    }
    return null;
  },

  // Get resource timing
  getResourceTiming() {
    if (typeof window !== 'undefined' && window.performance) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      return resources.map((resource) => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize || 0,
        type: resource.initiatorType,
      }));
    }
    return [];
  },

  // Get memory usage (if available)
  getMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usedPercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  },

  // Track page load performance
  trackPageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = this.getNavigationTiming();
          const resources = this.getResourceTiming();
          const memory = this.getMemoryUsage();

          console.log('Page Load Performance:', {
            timing,
            resourceCount: resources.length,
            totalResourceSize: resources.reduce((sum, r) => sum + r.size, 0),
            memory,
          });

          // Send to analytics
          fetch('/api/analytics/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ timing, resources, memory }),
          }).catch(console.error);
        }, 0);
      });
    }
  },
};

// Initialize performance tracking
if (typeof window !== 'undefined') {
  performanceMonitor.trackPageLoad();
}
