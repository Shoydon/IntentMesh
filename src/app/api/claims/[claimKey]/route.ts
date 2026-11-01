import { publicClient } from "@/lib/arkiv/client";
import { ClaimSchema } from "@/lib/arkiv/schema";
import { isHex } from "viem";

type RouteContext = {
  params: Promise<{
    claimKey: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { claimKey } = await params;

    if (!isHex(claimKey, { strict: true })) {
      return Response.json({ error: "Invalid claim key" }, { status: 400 });
    }

    const entity = await publicClient.getEntity(claimKey, ClaimSchema);

    return Response.json({
      entityKey: claimKey,
      owner: entity.$owner,
      expiresAt: entity.$expiresAt.toString(),
      intentKey: entity.intentKey.value,
      solver: entity.solver.value,

      indexed: {
        type: entity.type.value,
        status: entity.status.value,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve claim:", error);

    return Response.json(
      { error: "Failed to retrieve claim" },
      { status: 500 },
    );
  }
}
