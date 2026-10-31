import { publicClient } from "@/lib/arkiv/client";
import { updateIntentStatus } from "@/lib/arkiv/intents";
import { IntentSchema } from "@/lib/arkiv/schema";
import { IntentStatus } from "@/lib/arkiv/types";
import { HexString } from "@/types/string";
import { hexToString, isHex } from "viem";

type RouteContext = {
  params: Promise<{
    entityKey: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { entityKey } = await params;

    if (!isHex(entityKey, { strict: true })) {
      return Response.json({ error: "Invalid entity key" }, { status: 400 });
    }

    const entity = await publicClient.getEntity(entityKey, IntentSchema);

    return Response.json({
      entityKey,
      owner: entity.$owner,
      expiresAt: entity.$expiresAt.toString(),

      intent: JSON.parse(hexToString(entity.data.value)),

      indexed: {
        type: entity.type.value,
        status: entity.status.value,
        sourceChain: entity.sourceChain.value,
        destinationChain: entity.destinationChain.value,
      },
    });
  } catch (error) {
    console.error("Failed to retrieve intent:", error);

    return Response.json(
      { error: "Failed to retrieve intent" },
      { status: 500 },
    );
  }
}

const validStatuses: IntentStatus[] = [
  "OPEN",
  "CLAIMED",
  "COMPLETED",
  "CANCELLED",
];

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { entityKey } = await params;
    const body = await request.json();

    if (!isHex(entityKey, { strict: true })) {
      return Response.json(
        { error: "Invalid entity key" },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(body.status)) {
      return Response.json(
        { error: "Invalid intent status" },
        { status: 400 }
      );
    }

    const result = await updateIntentStatus(
      entityKey,
      body.status
    );

    return Response.json({
      success: true,
      entityKey,
      txHash: result.txHash,
    });
  } catch (error) {
    console.error("Intent update failed:", error);

    return Response.json(
      { error: "Failed to update intent" },
      { status: 500 }
    );
  }
}
