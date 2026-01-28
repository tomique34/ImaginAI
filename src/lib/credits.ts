export function applyCreditDebit(balance: number, cost: number) {
  const next = balance - cost;
  if (next < 0) throw new Error("INSUFFICIENT_CREDITS");
  return next;
}
