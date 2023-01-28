import { type FacebookAuthentication } from '@/domain/usecases'
import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type CreateFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationUseCase {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      await this.userAccountRepository.load({ email: fbData.email })
      await this.userAccountRepository.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
