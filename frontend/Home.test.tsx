import { describe, expect, it } from '@jest/globals'

import Home from '@/app/page'

describe('Home Page', () => {
  it('redirects users to the login page', () => {
    expect(() => Home()).toThrow('NEXT_REDIRECT')
  })
})
