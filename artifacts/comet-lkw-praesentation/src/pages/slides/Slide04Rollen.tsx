export default function Slide04Rollen() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        4
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">4 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Benutzerrollen
        </h1>
        <div className="flex-1 flex gap-[3vw]">
          <div className="flex-1 bg-primary rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col gap-[1.5vh] overflow-hidden">
            <p className="font-body font-medium text-[2.4vw] text-white opacity-60 uppercase tracking-widest">Intern — COMET</p>
            <div className="h-[0.3vh] bg-white opacity-15" />
            <div className="flex items-center gap-[2vw]">
              <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[1.8vw] text-white">CA</span>
              </div>
              <div>
                <p className="font-display font-bold text-[2.8vw] text-white leading-tight">COMET Admin</p>
                <p className="font-body text-[2.4vw] text-white opacity-55 leading-tight">Vollzugriff auf alle Funktionen</p>
              </div>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-white opacity-20 flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[1.8vw] text-primary">CL</span>
              </div>
              <div>
                <p className="font-display font-bold text-[2.8vw] text-white leading-tight">Leitstand</p>
                <p className="font-body text-[2.4vw] text-white opacity-55 leading-tight">Verladungen, Speditionen, Berichte</p>
              </div>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-white opacity-20 flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[1.8vw] text-primary">CG</span>
              </div>
              <div>
                <p className="font-display font-bold text-[2.8vw] text-white leading-tight">Lager</p>
                <p className="font-body text-[2.4vw] text-white opacity-55 leading-tight">Verladungen bearbeiten · Kanban</p>
              </div>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-white opacity-20 flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[1.8vw] text-primary">CV</span>
              </div>
              <div>
                <p className="font-display font-bold text-[2.8vw] text-white leading-tight">Viewer</p>
                <p className="font-body text-[2.4vw] text-white opacity-55 leading-tight">Lesezugriff auf operative Daten</p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col gap-[1.5vh] overflow-hidden">
            <p className="font-body font-medium text-[2.4vw] text-accent uppercase tracking-widest">Extern — Spedition</p>
            <div className="h-[0.3vh] bg-primary opacity-10" />
            <div className="flex items-center gap-[2vw]">
              <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[1.8vw] text-white">SA</span>
              </div>
              <div>
                <p className="font-display font-bold text-[2.8vw] text-primary leading-tight">Speditions-Admin</p>
                <p className="font-body text-[2.4vw] text-muted leading-tight">Partnerverwaltung · Freigaben</p>
              </div>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-primary opacity-15 flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[1.8vw] text-primary">SB</span>
              </div>
              <div>
                <p className="font-display font-bold text-[2.8vw] text-primary leading-tight">Bearbeiter</p>
                <p className="font-body text-[2.4vw] text-muted leading-tight">Eigene Verladungen anlegen</p>
              </div>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[3.5vw] h-[3.5vw] rounded-full bg-primary opacity-15 flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[1.8vw] text-primary">SV</span>
              </div>
              <div>
                <p className="font-display font-bold text-[2.8vw] text-primary leading-tight">Viewer</p>
                <p className="font-body text-[2.4vw] text-muted leading-tight">Lesezugriff auf eigene Daten</p>
              </div>
            </div>
            <div className="mt-auto pt-[2vh] border-t-[0.2vw] border-primary border-opacity-10">
              <p className="font-body text-[2.6vw] text-primary font-bold">7 Rollen gesamt</p>
              <p className="font-body text-[2.4vw] text-muted">4 intern · 3 extern</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
