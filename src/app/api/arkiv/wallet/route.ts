import { publicClient } from "@/lib/arkiv/client";
import { walletClient } from "@/lib/arkiv/client";
import { formatUnits } from "viem/utils";

export async function GET() {
  try {
    const address = walletClient.account.address;

    const balance = await publicClient.getBalance({
      address,
    });

    return Response.json({
      address,
      balanceWei: balance.toString(),
      balanceTGLM: formatUnits(balance, 18),
    });
  } catch (error) {
    console.error("Wallet balance check failed:", error);

    return Response.json(
      { error: "Failed to retrieve wallet balance" },
      { status: 500 }
    );
  }
}