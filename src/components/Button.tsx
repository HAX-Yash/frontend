import React from 'react';

interface ButtonProps {
    onClick: () => void;
    label: string;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className }) => {
    const buttonStyles = `bg-[#DCDCDC] text-black font-bold py-2 px-4 rounded ${className}`;

    return (
        <button onClick={onClick} className={buttonStyles}>
            {label}
        </button>
    );
};

export default Button;
