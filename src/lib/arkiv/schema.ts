import {
  defineSchema,
  str,
  i32,
  bytes,
  key,
  addr,
} from "@arkiv-network/sdk/schema";

export const IntentSchema = defineSchema("intentmesh.intents", {
  type: str().indexed(),
  status: str().indexed(),
  sourceChain: i32().indexed(),
  destinationChain: i32().indexed(),
  data: bytes(),
});

export const ClaimSchema = defineSchema("intentmesh.claims", {
  type: str().indexed(),
  intentKey: key().indexed(),
  solver: addr().indexed(),
  status: str().indexed(),
});