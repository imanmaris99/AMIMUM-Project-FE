import Image from "next/image";
import bag2 from "../../../public/assets/icons/bag-2.svg";
import notification from "../../../public/assets/icons/notification.svg";
import arrowDown from "../../../public/assets/icons/arrow-down.svg";

interface IconProps {
  icon: keyof typeof iconMap;
}

const iconMap = {
  bag2: bag2,
  notification: notification,
  arrowDown: arrowDown,
};

const Icon = ({ icon }: IconProps) => {
  return (
    <div>
      <Image src={iconMap[icon]} alt="icon" width={30} height={30} />
    </div>
  );
};

export default Icon;
