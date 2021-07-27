import { ethers } from 'ethers';
import { useState, useCallback } from 'react';
import { ens } from '../shared/constants';

export interface AccountState {
  verified: boolean;
  error: string;
  eth: string;
  ens: string;
  fancyEth: string;
}
type SetAccountCallback = (unverifiedAccount: string) => void;

export interface AccountHook {
  account: AccountState;
  setAccount: SetAccountCallback;
}

const generateFancyEth = (account: string): string =>
  `${account.slice(0, 6)}...${account.slice(-4)}`;

const isValidAddress = (account: string): boolean => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(account)) {
    // check if it has the basic requirements of an address
    return false;
  }

  return true;
};

function isValidEnsFormat(account: string): boolean {
  const regex = new RegExp(/[a-z.0-9]{2,}.\.eth$/);

  return regex.test(account);
}

const useAccount = (): AccountHook => {
  const [account, setAccountState] = useState<AccountState>({
    verified: false,
    error: '',
    eth: '',
    ens: '',
    fancyEth: '',
  });
  const [provider] = useState(
    new ethers.providers.InfuraProvider('mainnet', {
      infura: {
        projectId: ens.infura.projectID,
        projectSecret: ens.infura.key,
      },
    })
  );

  const execute = async (unverifiedAccount: string): Promise<void> => {
    const lowerCaseAccount = unverifiedAccount.toLowerCase();

    if (isValidAddress(lowerCaseAccount)) {
      try {
        const ensFromEth = await provider.lookupAddress(lowerCaseAccount);

        setAccountState({
          verified: true,
          error: '',
          eth: lowerCaseAccount,
          ens: ensFromEth,
          fancyEth: generateFancyEth(lowerCaseAccount),
        });
      } catch {
        setAccountState({
          verified: true,
          error: '',
          eth: lowerCaseAccount,
          ens: '',
          fancyEth: generateFancyEth(lowerCaseAccount),
        });
      }
    } else {
      try {
        if (isValidEnsFormat(lowerCaseAccount)) {
          const address = await provider.resolveName(lowerCaseAccount);

          if (address) {
            const lowerCaseAddress = address.toLowerCase();

            setAccountState({
              verified: true,
              error: '',
              eth: lowerCaseAddress,
              ens: lowerCaseAccount,
              fancyEth: generateFancyEth(lowerCaseAddress),
            });
          } else {
            setAccountState({
              verified: true,
              error: 'The input is not an active ENS domain',
              eth: '',
              ens: '',
              fancyEth: '',
            });
          }
        } else {
          setAccountState({
            verified: true,
            error:
              'The input is not a valid ETH address neither a valid ETH domain.',
            eth: '',
            ens: '',
            fancyEth: '',
          });
        }
      } catch {
        setAccountState({
          verified: true,
          error: 'there was an error resolving the ETH domain',
          eth: '',
          ens: '',
          fancyEth: '',
        });
      }
    }
  };

  const setAccount = useCallback<SetAccountCallback>(
    (unverifiedAccount) => execute(unverifiedAccount),
    []
  );

  return { account, setAccount };
};

export default useAccount;
