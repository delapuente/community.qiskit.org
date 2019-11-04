import Vue from 'vue'

interface AnalyticsContext {
  bluemixAnalytics?: any
  digitalData?: any
  location: Pick<Location, 'href' | 'pathname'>
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

declare global {
  interface Window extends AnalyticsContext {}
}

function trackClickEvent(context: AnalyticsContext, params: ClickEventParams) {
  const { action, objectType, milestoneName } = params
  if (context.bluemixAnalytics && context.digitalData) {
    const { bluemixAnalytics, digitalData, location } = context
    let segmentEvent: CustomEvent = {
      productTitle: digitalData.page.pageInfo.productTitle,
      category: digitalData.page.pageInfo.analytics.category,
      url: location.href,
      path: location.pathname,
      action: `${location.href} - Button Clicked: ${action}`,
      objectType,
      successFlag: true
    }

    if (milestoneName) {
      segmentEvent = { ...segmentEvent, milestoneName }
    }

    bluemixAnalytics.trackEvent('Custom Event', segmentEvent)
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $trackClickEvent(params: ClickEventParams): void
  }
}

Vue.prototype.$trackClickEvent =
  (params: ClickEventParams) => trackClickEvent(window, params)

export { trackClickEvent, ClickEventParams, AnalyticsContext }
