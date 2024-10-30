interface TagProps {
    title: string;
    isSelected: boolean;
    onClick: () => void;
}

const Tag = ({ title, isSelected, onClick }: TagProps) => {

    return (
        <div className={`border border-gray-200 rounded-full px-4 py-2 w-fit ${isSelected ? "bg-customGreen1 text-white" : ""}`} onClick={onClick}>
            <p className="font-jakarta text-xs">{title}</p>
        </div>
    )
}

export default Tag;
