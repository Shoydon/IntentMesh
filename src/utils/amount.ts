export const isValidAmount = (amount: unknown): boolean => {
  return (
    typeof amount === "string" &&
    /^\d+(\.\d+)?$/.test(amount)
  );
};