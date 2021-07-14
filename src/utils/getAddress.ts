import { ethers } from 'ethers';

export default async function getAddress(account: string): Promise<string> {
  if (isValidAddress(account)) return account;
  if (isValidEnsFormat(account)) {
    try {
      const address = await resolveENS(account);

      return address;
    } catch (e) {
      return '';
    }
  }

  return '';
}

function isValidEnsFormat(account: string): boolean {
  const regex = new RegExp(/[a-z.0-9]{2,}.\.eth$/);

  return regex.test(account);
}

async function resolveENS(account: string): Promise<string> {
  const provider = new ethers.providers.CloudflareProvider();

  return provider.resolveName(account);
}

const isValidAddress = (account: string): boolean => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(account)) {
    // check if it has the basic requirements of an address
    return false;
  }
  if (
    /^(0x)?[0-9a-f]{40}$/.test(account) ||
    /^(0x)?[0-9A-F]{40}$/.test(account)
  ) {
    // If it's all small caps or all all caps, return true
    return true;
  }

  // Otherwise check each case
  return isChecksumAddress(account);
};

const isChecksumAddress = (address: string): boolean => {
  // Check each case
  const stripAddress = address.replace('0x', '');
  const addressHash = ethers.utils.keccak256(stripAddress.toLowerCase());

  for (let i = 0; i < 40; i + 1) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 &&
        address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 &&
        address[i].toLowerCase() !== address[i])
    ) {
      return false;
    }
  }

  return true;
};
