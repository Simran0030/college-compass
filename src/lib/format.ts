/** Format fees in INR as ₹X.XL/yr */
export function formatFees(fees: number): string {
  const lakhs = fees / 100000;
  return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L/yr`;
}

/** Format package in LPA */
export function formatPackage(lpa: number): string {
  return `₹${lpa}L/yr`;
}

/** Format rating to 1 decimal */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
