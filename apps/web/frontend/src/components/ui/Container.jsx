export default function Container({ children, className = "" }) {
  return (
    <div className={`cw-container ${className}`}>
      {children}
    </div>
  );
}