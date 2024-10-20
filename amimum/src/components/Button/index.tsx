interface ButtonProps {
    className?: string;
    onClick: () => void;
}

const Button = ({ className, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} className={`bg-customGreen1 text-white px-4 py-1 rounded-lg ${className}`}>
            Cari
        </button>
    )
}

export default Button;

