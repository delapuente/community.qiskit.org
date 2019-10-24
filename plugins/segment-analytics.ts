declare global {
  interface Window {
    bluemixAnalytics: any
    digitalData: any
  }
}

interface ClickEventParams {
  action: string
  objectType: string
  milestoneName?: string
}

interface CustomEvent {
  milestoneName?: any
  productTitle: string
  category: string,
  url: string,
  path: string,
  action: string,
  objectType: string,
  successFlag: boolean
}

export function trackClickEvent (params: ClickEventParams) {
  const { action, objectType, milestoneName } = params;
  if (window.bluemixAnalytics && window.digitalData) {
    let segmentEvent: CustomEvent = {
      productTitle: window.digitalData.page.pageInfo.productTitle,
      category: window.digitalData.page.pageInfo.analytics.category,
      url: window.location.href,
      path: window.location.pathname,
      action: `${window.location.href} - Button Clicked: ${action}`,
      objectType,
      successFlag: true,
    };

    if (milestoneName) {
      segmentEvent = { ...segmentEvent, milestoneName };
    }

    window.bluemixAnalytics.trackEvent('Custom Event', segmentEvent);
  }
};