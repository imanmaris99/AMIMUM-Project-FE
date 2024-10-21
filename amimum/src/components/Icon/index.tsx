import Image from "next/image";
import bag2 from "../../../public/assets/icons/bag-2.svg";
import notification from "../../../public/assets/icons/notification.svg";
import arrowDown from "../../../public/assets/icons/arrow-down.svg";
import home from "../../../public/assets/icons/Home.svg";
import wallet from "../../../public/assets/icons/wallet-add.svg";
import account from "../../../public/assets/icons/account.svg";
import heart from "../../../public/assets/icons/heart.svg";

interface IconProps {
  icon: keyof typeof iconMap;
  className?: string;
}

const iconMap = {
  bag2: bag2,
  notification: notification,
  arrowDown: arrowDown,
  home: home,
  wallet: wallet,
  account: account,
  heart: heart,
};

const Icon = ({ icon, className }: IconProps) => {
  return (
    <div>
      <Image src={iconMap[icon]} alt="icon" width={30} height={30} className={className} />
    </div>
  );
};

export default Icon;
