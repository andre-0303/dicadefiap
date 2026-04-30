import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full px-4 pt-6 pb-10">
      {/* Autor */}
      <p className="text-xs text-cyan-400 mb-10 font-mono">
        <a
          href="https://github.com/andre-0303"
          target="_blank"
          rel="noopener noreferrer"
        >
          por: @andre-0303
        </a>
      </p>

      {/* Logo pixel art centralizado */}
      <div className="text-center mb-14">
        <Link to="/" className="inline-block">
          <h1
            className="text-white leading-tight tracking-wide select-none"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "clamp(1.8rem, 6vw, 3.2rem)",
              textShadow: [
                "3px 3px 0 #3730a3",
                "6px 6px 0 #312e81",
                "9px 9px 0 #1e1b4b",
                "12px 12px 0 #0f0e2e",
              ].join(", "),
            }}
          >
            DICA DA FIAP
          </h1>
        </Link>
      </div>
    </header>
  );
}
