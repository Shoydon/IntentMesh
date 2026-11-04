import { publicClient } from "./client";
import { IntentSchema } from "./schema";
import { and, eq } from "@arkiv-network/sdk/query";
import { IntentFilter, IntentPayload } from "./types";

export async function getAllOpenIntents() {
  const { entities } = await publicClient
    .select({
      $key: true,
      $owner: true,
      $expiresAt: true,
      type: true,
      status: true,
      sourceChain: true,
      destinationChain: true,
      data: true,
    })
    .from(IntentSchema)
    .where(eq("status", "OPEN"))
    .fetch();

  return entities;
}

export async function getFilteredIntents(filters: IntentFilter) {
  const conditions = [];

  if (filters.sourceChain !== undefined) {
    conditions.push(eq("sourceChain", filters.sourceChain));
  }
  if (filters.destinationChain !== undefined) {
    conditions.push(eq("destinationChain", filters.destinationChain));
  }
  if (filters.status !== undefined) {
    conditions.push(eq("status", filters.status));
  }

  const query = publicClient
    .select({
      $key: true,
      $owner: true,
      $expiresAt: true,
      type: true,
      status: true,
      sourceChain: true,
      destinationChain: true,
      data: true,
    })
    .from(IntentSchema);

  const { entities } = await (
    conditions.length ? query.where(and(...conditions)) : query
  ).fetch();

  return entities;
}
