import Vue from 'vue'

interface AnalyticsContext {
  bluemixAnalytics: any
  digitalData: any
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
    let segmentEvent: CustomEvent = {
      productTitle: context.digitalData.page.pageInfo.productTitle,
      category: context.digitalData.page.pageInfo.analytics.category,
      url: context.location.href,
      path: context.location.pathname,
      action: `${context.location.href} - Button Clicked: ${action}`,
      objectType,
      successFlag: true
    }

    if (milestoneName) {
      segmentEvent = { ...segmentEvent, milestoneName }
    }

    context.bluemixAnalytics.trackEvent('Custom Event', segmentEvent)
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
