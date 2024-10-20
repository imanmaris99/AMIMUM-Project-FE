import Image from "next/image";
import bag2 from "../../../public/assets/icons/bag-2.svg";
import notification from "../../../public/assets/icons/notification.svg";

interface IconProps {
    icon: string;
}

const Icon = ({ icon }: IconProps) => {
    return (
        <div>
            <Image src={icon === "bag2" ? bag2 : notification} alt="icon" width={30} height={30} />
        </div>
    )
}

export default Icon;
