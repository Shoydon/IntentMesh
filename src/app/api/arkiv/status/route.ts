import { publicClient } from "@/lib/arkiv/client";

export async function GET() {
  try {
    const [chainId, blockNumber] = await Promise.all([
      publicClient.getChainId(),
      publicClient.getBlockNumber(),
    ]);

    return Response.json({
      connected: true,
      network: "Rabdi",
      chainId,
      blockNumber: blockNumber.toString(),
    });
  } catch (error) {
    console.error("Arkiv connection failed:", error);

    return Response.json(
      {
        connected: false,
        error: "Failed to connect to Arkiv",
      },
      { status: 503 }
    );
  }
}