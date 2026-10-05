import TagProps from "./types";

const Tag = ({ title, isSelected, onClick }: TagProps) => {
  return (
    <button
      type="button"
      className={`border border-gray-200 rounded-full px-4 py-2 w-fit cursor-pointer ${
        isSelected ? "bg-primary text-white" : "bg-white/80 text-[#0D0E09]"
      }`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <span className="font-jakarta text-xs">{title}</span>
    </button>
  );
};

export default Tag;
