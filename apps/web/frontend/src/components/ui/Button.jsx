import { Link } from "react-router-dom";

const variants = {
  primary:
    "border border-[#00e887] bg-[#00e887] text-[#04110b] hover:bg-[#5bf5b0]",
  secondary:
    "border border-[#28343e] bg-[#0d1319] text-white hover:border-[#526473] hover:bg-[#111a22]",
  ghost:
    "border border-transparent bg-transparent text-[#c3cfda] hover:bg-white/5 hover:text-white",
};

export default function Button({
  children,
  to,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
}) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00e887] ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}