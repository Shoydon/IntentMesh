import { HexString } from "./types/string";

export const accountPrivateKey = process.env.PRIVATE_KEY as HexString;

export const arkivAccessKey = process.env.ARKIV_ACCESS_KEY as string;