import React from 'react';
import BasketUnlockCheckout from '../basket/BasketUnlockCheckout';

export default function BasketInvestSidebar({
  basket,
  paid,
  form,
  onFormChange,
  onPay,
  paying,
  error,
}) {
  return (
    <aside className="an-invest-sidebar an-basket-checkout-sidebar">
      <BasketUnlockCheckout
        basket={basket}
        form={form}
        onChange={onFormChange}
        onPay={onPay}
        paying={paying}
        error={error}
        paid={paid}
      />
    </aside>
  );
}
