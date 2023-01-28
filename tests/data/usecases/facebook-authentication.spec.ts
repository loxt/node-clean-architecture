import { type FacebookAuthentication } from '@/domain/usecases'

class FacebookAuthenticationUseCase {
  constructor (private readonly LoadFacebookUserApi: LoadFacebookUserApi) {}

  async execute (params: FacebookAuthentication.Params): Promise<void> {
    await this.LoadFacebookUserApi.loadUser(params)
  }
}

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('FacebookAuthenticationUseCase unit tests', function () {
  it('should call LoadFacebookUserApi with correct params', async function () {
    const LoadFacebookUserApi = new LoadFacebookUserApiSpy()
    const usecase = new FacebookAuthenticationUseCase(LoadFacebookUserApi)
    await usecase.execute({
      token: 'any_token'
    })

    expect(LoadFacebookUserApi.token).toBe('any_token')
  })
})
