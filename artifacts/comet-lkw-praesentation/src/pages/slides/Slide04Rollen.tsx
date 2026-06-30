export default function Slide04Rollen() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        4
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">4 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Benutzerrollen
        </h1>
        <div className="flex-1 flex gap-[4vw]">
          <div className="flex-1 bg-primary rounded-[1.5vw] px-[4vw] py-[4vh] flex flex-col gap-[2.5vh]">
            <p className="font-body font-medium text-[2.6vw] text-white opacity-60 uppercase tracking-widest">Intern — COMET</p>
            <div className="flex flex-col gap-[2vh]">
              <div className="flex items-center gap-[2vw]">
                <div className="w-[4vw] h-[4vw] rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-[2vw] text-white">CA</span>
                </div>
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-white leading-tight">COMET Admin</p>
                  <p className="font-body text-[2.6vw] text-white opacity-60">Vollzugriff auf alle Funktionen</p>
                </div>
              </div>
              <div className="flex items-center gap-[2vw]">
                <div className="w-[4vw] h-[4vw] rounded-full bg-white opacity-20 flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-[2vw] text-primary">CL</span>
                </div>
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-white leading-tight">Leitstand</p>
                  <p className="font-body text-[2.6vw] text-white opacity-60">Verladungen, Speditionen, Berichte</p>
                </div>
              </div>
              <div className="flex items-center gap-[2vw]">
                <div className="w-[4vw] h-[4vw] rounded-full bg-white opacity-20 flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-[2vw] text-primary">CG</span>
                </div>
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-white leading-tight">Lager</p>
                  <p className="font-body text-[2.6vw] text-white opacity-60">Verladungen bearbeiten, Kanban</p>
                </div>
              </div>
              <div className="flex items-center gap-[2vw]">
                <div className="w-[4vw] h-[4vw] rounded-full bg-white opacity-20 flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-[2vw] text-primary">CV</span>
                </div>
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-white leading-tight">Viewer</p>
                  <p className="font-body text-[2.6vw] text-white opacity-60">Lesezugriff auf operative Daten</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-card rounded-[1.5vw] px-[4vw] py-[4vh] flex flex-col gap-[2.5vh]">
            <p className="font-body font-medium text-[2.6vw] text-accent uppercase tracking-widest">Extern — Spedition</p>
            <div className="flex flex-col gap-[2vh]">
              <div className="flex items-center gap-[2vw]">
                <div className="w-[4vw] h-[4vw] rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-[2vw] text-white">SA</span>
                </div>
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Speditions-Admin</p>
                  <p className="font-body text-[2.6vw] text-muted">Partnerverwaltung, Freigaben</p>
                </div>
              </div>
              <div className="flex items-center gap-[2vw]">
                <div className="w-[4vw] h-[4vw] rounded-full bg-primary opacity-15 flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-[2vw] text-primary">SB</span>
                </div>
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Bearbeiter</p>
                  <p className="font-body text-[2.6vw] text-muted">Eigene Verladungen anlegen</p>
                </div>
              </div>
              <div className="flex items-center gap-[2vw]">
                <div className="w-[4vw] h-[4vw] rounded-full bg-primary opacity-15 flex items-center justify-center shrink-0">
                  <span className="font-display font-extrabold text-[2vw] text-primary">SV</span>
                </div>
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Viewer</p>
                  <p className="font-body text-[2.6vw] text-muted">Lesezugriff auf eigene Daten</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
