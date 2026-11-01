import { ExpirationTime } from "@arkiv-network/sdk";
import { addr, key } from "@arkiv-network/sdk/schema";

import { walletClient } from "./client";
import { ClaimSchema } from "./schema";

import type { HexString } from "@/types/string";

export async function createClaim(intentKey: HexString) {
  const result = await walletClient.createEntity(
    ClaimSchema,
    {
      type: "claim",
      intentKey: key(intentKey),
      solver: addr(walletClient.account.address),
      status: "ACTIVE",
    },
    {
      expiration: ExpirationTime.fromHours(1),
    },
  );

  return {
    entityKey: result.entityKey,
    txHash: result.txHash,
    expiresAt: result.expiresAt,
  };
}
