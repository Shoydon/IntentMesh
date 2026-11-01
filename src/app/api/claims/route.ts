import { createClaim } from "@/lib/arkiv/claims";
import type { HexString } from "@/types/string";
import { isHex } from "viem";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { intentKey } = body;

    if (
      typeof intentKey !== "string" ||
      intentKey.length !== 66 ||
      !isHex(intentKey, { strict: true })
    ) {
      return Response.json(
        { success: false, error: "Invalid intent key" },
        { status: 400 }
      );
    }

    const result = await createClaim(intentKey as HexString);

    return Response.json({
      success: true,
      entityKey: result.entityKey,
      txHash: result.txHash,
      expiresAt: result.expiresAt.toString(),
    });
  } catch (error) {
    console.error("Claim creation failed:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Claim creation failed",
      },
      { status: 500 }
    );
  }
}