export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/5 py-8">
      <div className="container-page">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white font-bold text-[10px]">
              TY
            </div>
            <span className="font-semibold text-sm">Taha Yasir</span>
          </div>
          <div className="flex items-center gap-5 text-xs text-ink-dim">
            <a href="mailto:Taha@qaysariya.com" className="hover:text-ink-muted transition-colors">
              Taha@qaysariya.com
            </a>
            <span>·</span>
            <a href="mailto:Taha@qaysariya.com" className="hover:text-ink-muted transition-colors">
              Taha@qaysariya.com
            </a>
          </div>
          <p className="text-xs text-ink-dim">© {year} Taha Yasir</p>
        </div>
      </div>
    </footer>
  );
}
