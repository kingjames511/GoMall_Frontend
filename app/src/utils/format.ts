/** Format a numeric price into Naira currency string, e.g. 21000 -> "₦21,000". */
export const formatPrice = (value: number): string => {
  return `₦${value.toLocaleString()}`;
};

/** Format a large count into a compact string, e.g. 1200 -> "1.2k", 2450 -> "2,450". */
export const formatCount = (value: number): string => {
  if (value >= 1000) {
    const compact = value / 1000;
    // Show one decimal for values under 10k (1.2k), else round (12k)
    return compact < 10
      ? `${compact.toFixed(1).replace(/\.0$/, "")}k`
      : `${Math.round(compact)}k`;
  }
  return value.toLocaleString();
};
