import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('Test0', {
  clientId: '2ohQeyAH4n5iyHpou8yesrDuD1Bi8TnN8Qv',
  signer: SimpleSigner('70cd33f46989fcfba2dbb538d4c18932fd215e5534fdaf7f7b82b52c9183451f')
})

const web3 = uport.getWeb3()
export { web3, uport }
