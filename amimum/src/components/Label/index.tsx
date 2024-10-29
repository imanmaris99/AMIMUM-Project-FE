interface LabelProps {
    title: string;
    isSelected: boolean;
    onClick: () => void;
}

const Label = ({ title, isSelected, onClick }: LabelProps) => {

    return (
        <div className={`border border-gray-200 rounded-full px-4 py-2 w-fit ${isSelected ? "bg-customGreen1 text-white" : ""}`} onClick={onClick}>
            <p className="font-jakarta text-xs">{title}</p>
        </div>
    )
}

export default Label;
