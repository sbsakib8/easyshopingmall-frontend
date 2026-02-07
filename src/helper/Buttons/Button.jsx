
const Button = ({className,children}) => {
    return <button className={`bg-btn-color text-accent-content cursor-pointer ${className}`}>{children}</button>
};

export default Button;