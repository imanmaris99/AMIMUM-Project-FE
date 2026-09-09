import Order1Page from '@/components/order/Order1Page';
import LoginProtection from '@/components/common/LoginProtection';

export default function Order1() {
  return (
    <LoginProtection useModal={true} feature="general">
      <Order1Page />
    </LoginProtection>
  );
}

