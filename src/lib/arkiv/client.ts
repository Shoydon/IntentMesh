import "server-only";

import { createPublicClient, createWalletClient } from "@arkiv-network/sdk";
import { rabdi } from "@arkiv-network/sdk/chains";
import { http } from "viem";
import { accountPrivateKey, arkivAccessKey } from "@/envConfig";
import { privateKeyToAccount } from "viem/accounts";

const chain = rabdi({
  accessKey: arkivAccessKey,
});

// write client
export const walletClient = createWalletClient({
  chain: chain,
  transport: http(),
  account: privateKeyToAccount(accountPrivateKey),
});

// public read client
export const publicClient = createPublicClient({
  chain,
  transport: http(),
});