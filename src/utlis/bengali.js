// Bengali formatting utilities

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts English digits in a number/string to Bengali digits
 * Example: 1250 -> '১,২৫০'
 */
export function toBengaliNumber(num, withCommas = true) {
  if (num === null || num === undefined || num === '') return '';
  
  let str = String(num);
  
  if (withCommas && !isNaN(Number(num))) {
    // Format with commas according to South Asian numbering (or standard locale)
    str = Number(num).toLocaleString('en-US');
  }

  return str.replace(/\d/g, (digit) => bengaliDigits[Number(digit)] || digit);
}

/**
 * Formats a price into Bengali currency format
 * Example: 1099 -> '৳১,০৯৯'
 */
export function toBengaliPrice(price) {
  if (price === null || price === undefined) return '৳০';
  const cleanPrice = typeof price === 'number' ? Math.round(price) : Math.round(Number(price) || 0);
  return `৳${toBengaliNumber(cleanPrice, true)}`;
}

/**
 * Formats a discount percent into Bengali text
 * Example: 8 -> '০৮% ছাড়' or '৮% ছাড়'
 */
export function toBengaliDiscount(discount) {
  if (!discount) return '';
  const val = Math.round(Number(discount) || 0);
  if (val <= 0) return '';
  const formatted = val < 10 ? `০${toBengaliNumber(val, false)}` : toBengaliNumber(val, false);
  return `${formatted}% ছাড়`;
}
