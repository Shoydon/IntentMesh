import { ExpirationTime } from "@arkiv-network/sdk";
import { hexToString, stringToBytes } from "viem";
import { publicClient, walletClient } from "./client";
import { IntentSchema } from "./schema";
import type { IntentPayload, IntentStatus } from "./types";
import { HexString } from "@/types/string";

export async function createIntent(intent: IntentPayload) {
  const values = {
    type: "intent",
    status: intent.status,
    sourceChain: intent.sourceChain,
    destinationChain: intent.destinationChain,
    data: stringToBytes(JSON.stringify(intent)),
  };

  const result = await walletClient.createEntity(
    IntentSchema,
    values,
    {
      expiration: ExpirationTime.fromHours(24),
    }
  );

  return {
    entityKey: result.entityKey,
    txHash: result.txHash,
    expiresAt: result.expiresAt,
  };
}

export async function updateIntentStatus(
  entityKey: HexString,
  status: IntentStatus
) {
  // 1. Retrieve the existing entity
  const entity = await publicClient.getEntity(
    entityKey,
    IntentSchema
  );

  // 2. Decode the existing payload
  const payload = JSON.parse(
    hexToString(entity.data.value)
  ) as IntentPayload;

  // 3. Update the payload while preserving other fields
  const updatedPayload: IntentPayload = {
    ...payload,
    status,
  };

  // 4. Patch both the indexed column and payload
  const result = await walletClient.patchEntity(
    IntentSchema,
    entityKey,
    {
      set: {
        //attribute update (affects indexed columns)
        status,
        // payload update
        data: stringToBytes(JSON.stringify(updatedPayload)),
      },
    }
  );

  return result;
}