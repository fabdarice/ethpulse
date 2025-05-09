import { Alchemy, Network } from "alchemy-sdk";
import { getValidatorBalance } from "./beaconchain";

const config = {
  apiKey: process.env.ALCHEMY_SECRET_KEY,
};

const networks = [
  { name: "Ethereum Mainnet", value: Network.ETH_MAINNET },
  { name: "Base Mainnet", value: Network.BASE_MAINNET },
  { name: "Optimism", value: Network.OPT_MAINNET },
  { name: "Arbitrum", value: Network.ARB_MAINNET },
  { name: "zkSync", value: Network.ZKSYNC_MAINNET },
  { name: "Linea", value: Network.LINEA_MAINNET },
  { name: "Gnosis", value: Network.GNOSIS_MAINNET },
  // { name: "Mantle", value: Network.MANTLE_MAINNET }, // Mantle is not supported by Alchemy APIs yet
];

// Define the ERC20 tokens to include with their contract addresses per network
const tokensPerNetwork: {
  [key: string]: {
    stETH?: string; // Lido ETH
    wstETH?: string; // wrapped Lido ETH
    rETH?: string; // Rocket Pool ETH
    WETH?: string; // Wrapped ETH
    aEthWETH?: string; // Aave Wrapped ETH
    aEthwstETH?: string;
    aEthweETH?: string;
    oETH?: string; // Origin ETH
    ankrETH?: string; // Ankr ETH
    ETHx?: string; // ETHx
    aGnowstETH?: string; // Aave Gnosis wstETH
    aGnowWETH?: string; // Aave Gnosis WETH
    auraBrETHSTABLEvault?: string; // Aura Balancer rETH/WETH Pool
    aurawstETHWETHBPTvault?: string; // Aura Balancer wstETH/WETH BPT
    ostETHwETHBPT?: string; // Balancer ostETH/WETH BPT
    rsETH?: string; // Kelp rsETH
    eETH?: string; // Ether.fi ETH
    weETH?: string; // Wrapped Ether.fi ETH
    armWETHstETH?: string; // Lido Arm WETH/stETH
    dWSTETHV3?: string; // Gearbox dWSTETHv3
    cmETH?: string; // Manetle Restaked ETH
    mETH?: string; // Manetle Staked ETH
    aBasWETH?: string; // Aave Base WETH
    aBaswstETH?: string; // Aave Base wstETH
    aArbWETH?: string; // Aave Arbitrum WETH
    aArbweETH?: string; // Aave Arbitrum Wrapped Ether.fi ETH
    aArbwstETH?: string; // Aave Arbitrum wstETH
    aArbrETH?: string; // Aave Arbitrum rETH
    aEthsrETH?: string; // Aave rETH
    aEthosETH?: string; // Aave osETH
    osETH?: string; // osETH
    aEthrETH?: string; // Aave rETH
    aEthETHX?: string; // Aave ETHx
    aOptWETH?: string; // Aave Optimism WETH
    aOptwstETH?: string; // Aave Optimism wstETH
  };
} = {
  [Network.ETH_MAINNET]: {
    stETH: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // Lido stETH
    rETH: "0xae78736Cd615f374D3085123A210448E74Fc6393", // Rocket Pool rETH
    WETH: "0xC02aaA39b223FE8D0A0E5C4F27eAD9083C756Cc2", // WETH
    aEthWETH: "0x4d5F47FA6A74757f35C14fD3a6Ef8E3C9BC514E8", // Aave WETH
    aEthwstETH: "0x0B925eD163218f6662a35e0f0371Ac234f9E9371", // Aave Lido stETH
    aEthweETH: "0xBdfa7b7893081B35Fb54027489e2Bc7A38275129", // Aave EtherFI ETH
    wstETH: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0", // Lido wstETH
    oETH: "0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3", // Origin ETH
    ankrETH: "0xE95A203B1a91a908F9B9CE46459d101078c2c3cb", // Ankr ETH
    ETHx: "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b", // ETHx
    auraBrETHSTABLEvault: "0xDd1fE5AD401D4777cE89959b7fa587e569Bf125D", // Aura Balancer rETH/WETH Pool
    aurawstETHWETHBPTvault: "0x2a14dB8D09dB0542f6A371c0cB308A768227D67D", // Aura Balancer wstETH/WETH BPT
    ostETHwETHBPT: "0xc592c33e51A764B94DB0702D8BAf4035eD577aED", // Balancer ostETH/WETH BPT
    rsETH: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7", // Kelp rsETH
    aEthsrETH: "0x2D62109243b87C4bA3EE7bA1D91B0dD0A074d7b1", // Aave rETH
    eETH: "0x35fA164735182de50811E8e2E824cFb9B6118ac2", // Ether.fi ETH
    weETH: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee", // Wrapped Ether.fi ETH
    armWETHstETH: "0x85B78AcA6Deae198fBF201c82DAF6Ca21942acc6", // Lido Arm WETH/stETH
    dWSTETHV3: "0xFF94993fA7EA27Efc943645F95Adb36C1b81244b", // Gearbox dWSTETHv3
    aEthosETH: "0x927709711794F3De5DdBF1D176bEE2D55Ba13c21", // Aave osETH
    osETH: "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38", // osETH
    aEthrETH: "0xCc9EE9483f662091a1de4795249E24aC0aC2630f", // Aave rETH
    aEthETHX: "0x1c0E06a0b1A4c160c17545FF2A951bfcA57C0002", // Aave ETHx
  },
  [Network.BASE_MAINNET]: {
    wstETH: "0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452", // lido wstETH
    WETH: "0x4200000000000000000000000000000000000006",
    aBasWETH: "0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7", // Aave Base WETH
    aBaswstETH: "0x99CBC45ea5bb7eF3a5BC08FB1B7E56bB2442Ef0D", // Aave Base wstETH
  }, // Add tokens for Base
  [Network.ARB_MAINNET]: {
    wstETH: "0x5979D7b546E38E414F7E9822514be443A4800529", // lido wstETH
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    aArbWETH: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8", // Aave Arbitrum WETH
    weETH: "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe", // Wrapped Ether.fi ETH
    aArbweETH: "0x8437d7C167dFB82ED4Cb79CD44B7a32A1dd95c77", // Aave Arbitrum Wrapped Ether.fi ETH
    aArbwstETH: "0x513c7E3a9c69cA3e22550eF58AC1C0088e918FFf", // Aave Arbitrum wstETH
    rETH: "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8", // Rocket Pool rETH
    aArbrETH: "0x8Eb270e296023E9D92081fdF967dDd7878724424", // Aave Arbitrum rETH
  }, // Add tokens for Arbitrum
  [Network.OPT_MAINNET]: {
    wstETH: "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb", // lido wstETH
    WETH: "0x4200000000000000000000000000000000000006",
    aOptWETH: "0xe50fA9b3c56FfB159cB0FCA61F5c9D750e8128c8", // Aave Optimism WETH
    aOptwstETH: "0xc45A479877e1e9Dfe9FcD4056c699575a1045dAA", // Aave Optimism wstETH
  }, // Add tokens for OP
  [Network.GNOSIS_MAINNET]: {
    WETH: "0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1", // Gnosis WETH
    aGnowstETH: "0x23e4E76D01B2002BE436CE8d6044b0aA2f68B68a", // Aave Gnosis wstETH
    aGnowWETH: "0xa818F1B57c201E092C4A2017A91815034326Efd1", // Aave Gnosis WETH
    wstETH: "0x6C76971f98945AE98dD7d4DFcA8711ebea946eA6", // lido wstETH
    rETH: "0xc791240D1F2dEf5938E2031364Ff4ed887133C3d", // Rocket Pool rETH
  }, // Add tokens for Gnosis
  [Network.MANTLE_MAINNET]: {
    cmETH: "0xe6829d9a7ee3040e1276fa75293bde931859e8fa", // Manetle Restaked ETH
    mETH: "0xcda86a272531e8640cd7f1a92c01839911b90bb0", // Manetle Staked ETH
  }, // Add tokens for Mantle
};

export const getETHBalanceAllNetworks = async (
  walletAddress: string
): Promise<bigint> => {
  const alchemyInstances = networks.map(({ name, value }) => ({
    name,
    alchemy: new Alchemy({
      ...config,
      network: value,
    }),
    networkValue: value,
  }));

  try {
    const balances = await Promise.all(
      alchemyInstances.map(async ({ name, alchemy, networkValue }) => {
        // Fetch native ETH balance
        const nativeBalance = await alchemy.core.getBalance(walletAddress);
        const nativeBalanceBigInt = BigInt(nativeBalance.toString());

        // Fetch ERC20 token balances
        const tokenAddresses = Object.values(
          tokensPerNetwork[networkValue] || {}
        ).filter((addr) => addr !== "0x...");
        let tokenBalancesBigInt: bigint = BigInt(0);

        if (tokenAddresses.length > 0) {
          const tokenBalancesResponse = await alchemy.core.getTokenBalances(
            walletAddress,
            tokenAddresses
          );

          // Iterate through each token balance and sum them
          tokenBalancesResponse.tokenBalances.forEach((token) => {
            if (
              token &&
              token.tokenBalance &&
              token.tokenBalance !==
                "0x0000000000000000000000000000000000000000000000000000000000000000"
            ) {
              tokenBalancesBigInt += BigInt(token.tokenBalance);
            }
          });
        }

        // Total ETH-equivalent balance for this network
        const totalNetworkBalance = nativeBalanceBigInt + tokenBalancesBigInt;

        return { name, balance: totalNetworkBalance };
      })
    );

    // Aggregate and display balances
    let totalBalance = BigInt(0);
    balances.forEach(({ name, balance }) => {
      totalBalance += balance;
    });

    const validatorBalance = await getValidatorBalance(walletAddress);

    return totalBalance + validatorBalance;
  } catch (error) {
    console.error("getETHBalanceAllNetworks error", error);
    throw error;
  }
};
