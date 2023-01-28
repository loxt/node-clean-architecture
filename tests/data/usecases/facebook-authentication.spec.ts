import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthenticationUseCase } from '@/data/usecases'

import { mock, type MockProxy } from 'jest-mock-extended'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { type LoadUserAccountRepository } from '@/data/contracts/repositories'

describe('FacebookAuthenticationUseCase unit tests', function () {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>
  let usecase: FacebookAuthenticationUseCase
  const token = 'any_token'

  beforeEach(function () {
    loadFacebookUserApi = mock()
    loadFacebookUserApi.loadUser.mockResolvedValue({
      name: 'any_name',
      email: 'any_email',
      id: 'any_id'
    })
    loadUserAccountRepository = mock()
    usecase = new FacebookAuthenticationUseCase(loadFacebookUserApi, loadUserAccountRepository)
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
  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async function () {
    await usecase.execute({
      token
    })
    expect(loadUserAccountRepository.load).toBeCalledWith({
      email: 'any_email'
    })
    expect(loadUserAccountRepository.load).toHaveBeenCalledTimes(1)
  })
})
