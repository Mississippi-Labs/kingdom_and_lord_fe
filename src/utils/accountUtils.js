import { Account, ec, stark, RpcProvider, hash, CallData } from 'starknet';

export const createAccount = async (nodeUrl) => {
  const provider = new RpcProvider({ nodeUrl });
  const classHash = import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH;
  const privateKey = stark.randomAddress();
  const publicKey = ec.starkCurve.getStarkKey(privateKey);
  const address = hash.calculateContractAddressFromHash(
    publicKey,
    classHash,
    CallData.compile({ publicKey }),
    0
  );
  const account = new Account(provider, address, privateKey, '1');
  const { transaction_hash } = await account.deployAccount({
    classHash,
    constructorCalldata: CallData.compile({ publicKey }),
    addressSalt: publicKey,
  });
  await account.waitForTransaction(transaction_hash);
  let burners = localStorage.getItem('burners') || '{}'
  burners = JSON.parse(burners)
  burners[address] = {
    active: true,
    publicKey,
    privateKey,
  }
  localStorage.setItem('burners', JSON.stringify(burners))
  return account;
}

export const getAccount = async (nodeUrl) => {
  const provider = new RpcProvider({ nodeUrl });
  let burners = localStorage.getItem('burners') || '{}'
  burners = JSON.parse(burners)
  let address = ''
  for (let key in burners) {
    if (burners[key].active) {
      address = key
      break
    }
  }
  if (!address) {
    return null
  }
  const account = new Account(provider, address, burners[address].privateKey, '1');
  return account;
}