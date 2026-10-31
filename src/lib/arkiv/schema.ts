import {
  defineSchema,
  str,
  i32,
  bytes,
} from "@arkiv-network/sdk/schema";

export const IntentSchema = defineSchema("intentmesh.intents", {
  type: str().indexed(),
  status: str().indexed(),
  sourceChain: i32().indexed(),
  destinationChain: i32().indexed(),
  data: bytes(),
});