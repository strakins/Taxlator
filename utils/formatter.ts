// utils/formatter.ts

export const formatCurrency = (amount: number) => {
  // We use 'en-GB' or 'en-US' sometimes because 'en-NG' support
  // can vary across different mobile OS versions
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount).replace('NGN', '₦');
};