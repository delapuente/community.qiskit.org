import { trackClickEvent, AnalyticsContext } from '~/plugins/segment-analytics'

const window: AnalyticsContext = {
  bluemixAnalytics: {
    trackEvent: jest.fn()
  },
  digitalData: {
    page: {
      pageInfo: {
        productTitle: 'Test Product Title',
        analytics: {
          category: 'Test Analytics Category'
        }
      }
    }
  },
  location: {
    href: 'http://test.com/test/path',
    pathname: '/test/path'
  }
}

describe('trackClickEvent', () => {

  beforeEach(() => {
    window.bluemixAnalytics.trackEvent.mockClear()
  })

  it('delegates in Bluemix Analytics `trackEvent` function', () => {
    trackClickEvent(window, {
      action: 'Test Action',
      objectType: 'Test Type',
      milestoneName: 'Test Milestone'
    })
    expect(window.bluemixAnalytics.trackEvent).toHaveBeenCalledTimes(1)
  })

  it('translates the event into a Bluemix Analytics "Custom Event"', () => {
    trackClickEvent(window, {
      action: 'Test Action',
      objectType: 'Test Type',
      milestoneName: 'Test Milestone'
    })
    expect(window.bluemixAnalytics.trackEvent).toHaveBeenCalledWith(
      'Custom Event',
      {
        productTitle: window.digitalData.page.pageInfo.productTitle,
        category: window.digitalData.page.pageInfo.analytics.category,
        url: window.location.href,
        path: window.location.pathname,
        action: `${window.location.href} - Button Clicked: Test Action`,
        objectType: 'Test Type',
        successFlag: true,
        milestoneName: 'Test Milestone'
      }
    )
  })
})

