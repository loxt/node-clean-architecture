import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAuthenticationUseCase } from '@/data/usecases'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result: undefined
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('FacebookAuthenticationUseCase unit tests', function () {
  it('should call LoadFacebookUserApi with correct params', async function () {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    const usecase = new FacebookAuthenticationUseCase(loadFacebookUserApi)
    await usecase.execute({
      token: 'any_token'
    })

    expect(loadFacebookUserApi.token).toBe('any_token')
  })
  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async function () {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy()
    loadFacebookUserApi.result = undefined

    const usecase = new FacebookAuthenticationUseCase(loadFacebookUserApi)
    const authResult = await usecase.execute({
      token: 'any_token'
    })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
