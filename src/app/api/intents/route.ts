import { NextRequest } from "next/server";
import { isAddress } from "viem";
import { createIntent } from "@/lib/arkiv/intents";
import { isValidAmount } from "@/utils/amount";
import { getAllOpenIntents, getFilteredIntents } from "@/lib/arkiv/queries";
import { serializeBigInt } from "@/utils/serialize";
import { IntentFilter, IntentStatus } from "@/lib/arkiv/types";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const sourceChain = params.get("sourceChain");
    const destinationChain = params.get("destinationChain");
    const status = params.get("status");

    const filters: IntentFilter = {};

    if (sourceChain !== null) {
      filters.sourceChain = Number(sourceChain);
    }

    if (destinationChain !== null) {
      filters.destinationChain = Number(destinationChain);
    }

    if (status !== null) {
      filters.status = status as IntentStatus;
    }
    if (
      (sourceChain !== null && !Number.isInteger(filters.sourceChain)) ||
      (destinationChain !== null && !Number.isInteger(filters.destinationChain))
    ) {
      return Response.json({ error: "Invalid chain ID" }, { status: 400 });
    }

    const hasFilters = Object.values(filters).some(
      (value) => value !== undefined,
    );

    const intents = hasFilters
      ? await getFilteredIntents(filters)
      : await getAllOpenIntents();

    return Response.json({
      success: true,
      count: intents.length,
      intents: serializeBigInt(intents),
    });
  } catch (error) {
    console.error("Intent query failed:", error);

    return Response.json({ error: "Failed to query intents" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !isAddress(body.token) ||
      !isAddress(body.recipient) ||
      !isValidAmount(body.amount) ||
      !Number.isInteger(body.sourceChain) ||
      !Number.isInteger(body.destinationChain)
    ) {
      return Response.json({ error: "Invalid intent data" }, { status: 400 });
    }

    const result = await createIntent({
      sourceChain: body.sourceChain,
      destinationChain: body.destinationChain,
      token: body.token,
      amount: body.amount,
      recipient: body.recipient,
      status: "OPEN",
    });

    return Response.json({
      success: true,
      entityKey: result.entityKey,
      txHash: result.txHash,
      expiresAt: result.expiresAt.toString(),
    });
  } catch (error) {
    console.error("Intent creation failed:", error);

    return Response.json({ error: "Failed to create intent" }, { status: 500 });
  }
}
