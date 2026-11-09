import { ExpirationTime } from "@arkiv-network/sdk";
import { addr, key } from "@arkiv-network/sdk/schema";
import { walletClient } from "./client";
import { ClaimSchema } from "./schema";
import { publicClient } from "./client";
import { IntentSchema } from "./schema";
import { getActiveClaimsForIntent } from "./queries";

import type { HexString } from "@/types/string";
import { hexToString, stringToBytes } from "viem";
import { IntentPayload } from "./types";

export async function createClaim(intentKey: HexString) {
  // 1. Fetch original intent
  const intent = await publicClient.getEntity(
    intentKey,
    IntentSchema
  );

  // 2. Validate intent status
  if (intent.status.value !== "OPEN") {
    throw new Error("Intent is not available for claiming");
  }

  // 3. Check existing active claims
  const existingClaims = await getActiveClaimsForIntent(intentKey);

  if (existingClaims.length > 0) {
    throw new Error("Intent already has an active claim");
  }

  // 4. Prepare updated intent payload
  const payload = JSON.parse(
    hexToString(intent.data.value)
  ) as IntentPayload;

  const updatedPayload: IntentPayload = {
    ...payload,
    status: "CLAIMED",
  };

  // 5. Create claim and update intent atomically
  const result = await walletClient.executeBatch({
    creates: [
      {
        schema: ClaimSchema,
        values: {
          type: "claim",
          intentKey: key(intentKey),
          solver: addr(walletClient.account.address),
          status: "ACTIVE",
        },
        expiration: ExpirationTime.fromHours(1),
      },
    ],
    patches: [
      {
        schema: IntentSchema,
        entityKey: intentKey,
        set: {
          status: "CLAIMED",
          data: stringToBytes(JSON.stringify(updatedPayload)),
        },
      },
    ],
  });

  return {
    entityKey: result.createdEntities[0],
    txHash: result.txHash,
  };
}
