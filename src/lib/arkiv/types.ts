import { HexString } from "@/types/string";

export type IntentStatus =
  | "OPEN"
  | "CLAIMED"
  | "COMPLETED"
  | "CANCELLED";

export type IntentPayload = {
  sourceChain: number;
  destinationChain: number;
  token: HexString;
  amount: string;
  recipient: HexString;
  status: IntentStatus;
};

export type IntentAttributes = {
  type: "intent";
  status: IntentStatus;
  sourceChain: number;
  destinationChain: number;
};