import { type FacebookAuthentication } from '@/domain/usecases'
import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type LoadUserAccountRepository, type SaveFacebookAccountRepository } from '@/data/contracts/repositories'

export class FacebookAuthenticationUseCase {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async execute (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.userAccountRepository.load({ email: fbData.email })
      await this.userAccountRepository.saveWithFacebook({
        id: accountData?.id,
        name: accountData?.name ?? fbData.name,
        email: fbData.email,
        facebookId: fbData.facebookId
      })
    }
    return new AuthenticationError()
  }
}
