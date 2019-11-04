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
  const { bluemixAnalytics, digitalData, location } = context

  if (!bluemixAnalytics || !digitalData) { return }

  const productTitle = getOrFailProductTitle(digitalData)
  const category = getOrFailCategory(digitalData)

  let segmentEvent: CustomEvent = {
    productTitle,
    category,
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

function getOrFailProductTitle(digitalData: any): string {
  return assertCanGet(
    () => digitalData.page.pageInfo.productTitle,
    '`digitalData.page.pageInfo.productTitle` is missing'
  )
}

function getOrFailCategory(digitalData: any): string {
  return assertCanGet(
    () => digitalData.page.pageInfo.analytics.category,
    '`digitalData.page.pageInfo.analytics.category` is missing'
  )
}

function assertCanGet(getter: () => any, error: string) {
  let result
  try {
    result = getter()
  } catch (ex) { }
  if (typeof result === 'undefined') {
    throw new Error(error)
  }
  return result
}

declare module 'vue/types/vue' {
  interface Vue {
    $trackClickEvent(params: ClickEventParams): void
  }
}

Vue.prototype.$trackClickEvent =
  (params: ClickEventParams) => trackClickEvent(window, params)

export { trackClickEvent, ClickEventParams, AnalyticsContext }
