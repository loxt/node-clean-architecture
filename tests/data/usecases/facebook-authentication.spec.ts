import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationUseCase } from '@/data/usecases'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type LoadUserAccountRepository, type SaveFacebookAccountRepository } from '@/data/contracts/repositories'

describe('FacebookAuthenticationUseCase unit tests', function () {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let usecase: FacebookAuthenticationUseCase
  const token = 'any_token'

  beforeEach(function () {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'any_email',
      facebookId: 'any_id'
    })
    userAccountRepository = mock()
    userAccountRepository.load.mockResolvedValue(undefined)
    usecase = new FacebookAuthenticationUseCase(facebookApi, userAccountRepository)
  })

  it('should call LoadFacebookUserApi with correct params', async function () {
    await usecase.execute({
      token
    })

    expect(facebookApi.loadUser).toBeCalledWith({
      token
    })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })
  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async function () {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await usecase.execute({
      token
    })
    expect(authResult).toEqual(new AuthenticationError())
  })
  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async function () {
    await usecase.execute({
      token
    })
    expect(userAccountRepository.load).toBeCalledWith({
      email: 'any_email'
    })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })
  it('should call SaveFacebookAccountRepo when LoadFacebookUserApi returns undefined', async function () {
    await usecase.execute({
      token
    })
    expect(userAccountRepository.saveWithFacebook).toBeCalledWith({
      email: 'any_email',
      name: 'any_name',
      facebookId: 'any_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
  it('should call UpdateFacebookAccountRepo when LoadFacebookUserApi returns data', async function () {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })
    await usecase.execute({
      token
    })
    expect(userAccountRepository.saveWithFacebook).toBeCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      facebookId: 'any_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call account name', async function () {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id'
    })
    await usecase.execute({
      token
    })
    expect(userAccountRepository.saveWithFacebook).toBeCalledWith({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      facebookId: 'any_id'
    })
    expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1)
  })
})
