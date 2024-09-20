interface CardProductionProps {
  name: string;
  isFeatured: boolean;
}

const CardProduction = ({ name, isFeatured }: CardProductionProps) => {
  return (
    <li
      className={`text-md flex items-center justify-center py-1 rounded-sm w-22 ${
        isFeatured ? "bg-fern text-white" : "bg-white text-fern"
      }`}
    >
      {name}
    </li>
  );
};

export default CardProduction;
