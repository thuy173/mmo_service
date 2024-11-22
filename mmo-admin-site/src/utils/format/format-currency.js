export const formatCurrencyVND = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0 VND';
    }
    
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  