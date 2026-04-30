import { Link, useLocation } from "react-router-dom";
import type { Category } from "../types";

type Props = {
  categories?: Category[];
};

export default function Header({ categories = [] }: Props) {
  const location = useLocation();
  const currentSlug = location.pathname.startsWith("/categoria/")
    ? location.pathname.replace("/categoria/", "")
    : null;

  return (
    <header>
      <div className="flex items-center gap-2 px-4 py-2 mt-10 bg-[#111] border-b border-[#1e1e1e]">
        <span className="text-[11px]">🔴</span>
        <span className="text-[11px]">🟡</span>
        <span className="text-[11px]">🟢</span>
        <span className="ml-2 text-xs text-[#525252]">dica-da-fiap — bash</span>
      </div>

      <div className="px-6 pt-10 pb-6">
        <Link to="/" className="block group">
          <h1 className="text-2xl font-bold tracking-tight text-white group-hover:text-accent transition-colors duration-150">
            DICA DA FIAP
            <span className="animate-pulse text-accent">_</span>
          </h1>
        </Link>
        <p className="mt-1 text-sm text-[#525252]">
          dicas pra sobreviver na fiap e sair com o máximo possível
        </p>
      </div>

      {/* Filtro por categoria */}
      {categories.length > 0 && (
        <nav className="px-6 pb-6 flex flex-wrap gap-2 text-xs">
          <Link
            to="/"
            className={`px-2 py-1 border rounded transition-colors duration-150 ${
              currentSlug === null && location.pathname === "/"
                ? "border-accent text-accent bg-accent/10"
                : "border-[#2a2a2a] text-[#525252] hover:border-[#444] hover:text-[#999]"
            }`}
          >
            todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/categoria/${cat.slug}`}
              className={`px-2 py-1 border rounded transition-colors duration-150 ${
                currentSlug === cat.slug
                  ? "border-current text-current bg-current/10"
                  : "border-[#2a2a2a] text-[#525252] hover:border-[#444] hover:text-[#999]"
              }`}
              style={
                currentSlug === cat.slug
                  ? { color: cat.cor, borderColor: cat.cor + "88" }
                  : {}
              }
            >
              {cat.nome.toLowerCase()}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
