import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationUseCase } from '@/data/usecases'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'

describe('FacebookAuthenticationUseCase unit tests', function () {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let usecase: FacebookAuthenticationUseCase
  const token = 'any_token'

  beforeEach(function () {
    loadFacebookUserApi = mock()
    usecase = new FacebookAuthenticationUseCase(loadFacebookUserApi)
  })

  it('should call LoadFacebookUserApi with correct params', async function () {
    await usecase.execute({
      token
    })

    expect(loadFacebookUserApi.loadUser).toBeCalledWith({
      token
    })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async function () {
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await usecase.execute({
      token
    })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
