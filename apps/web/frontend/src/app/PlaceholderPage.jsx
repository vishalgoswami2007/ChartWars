import { Link } from "react-router-dom";

export default function PlaceholderPage({ title }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#07090c] px-6 text-center">
      <Link
        to="/"
        className="text-xs font-bold tracking-[0.2em] text-[#00e887]"
      >
        CHARTWARS
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-white">{title}</h1>

      <p className="mt-3 max-w-md text-sm leading-7 text-[#8c9bad]">
        This screen is part of the planned application. We will implement it
        in a later step.
      </p>

      <Link
        to="/"
        className="mt-7 border border-[#28343e] px-5 py-3 text-sm text-white hover:border-[#00e887]"
      >
        Back to home
      </Link>
    </main>
  );
}