import { HexString } from "@/types/string";

export type IntentStatus =
  | "OPEN"
  | "CLAIMED"
  | "COMPLETED"
  | "CANCELLED";

export type ClaimStatus =
  | "ACTIVE"
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

export type IntentFilter = Partial<Omit<IntentPayload, "token" | "amount" | "recipient">>;

export type IntentAttributes = {
  type: "intent";
  status: IntentStatus;
  sourceChain: number;
  destinationChain: number;
};

export type ClaimPayload = {
  intentKey: HexString;
  solver: HexString;
  status: ClaimStatus;
};