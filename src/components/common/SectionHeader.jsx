function SectionHeader({ pretitle, title, children }) {
  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-[#D4AF37]/70 sm:text-xs sm:tracking-[0.35em]">{pretitle}</p>
      <h2 className="break-words text-3xl font-[TrajanPro] uppercase leading-tight tracking-[0.08em] text-white sm:text-5xl sm:tracking-[0.16em]">
        {title}
      </h2>
      {children && <p className="text-sm leading-7 text-white/70 sm:text-base">{children}</p>}
    </div>
  )
}

export default SectionHeader
