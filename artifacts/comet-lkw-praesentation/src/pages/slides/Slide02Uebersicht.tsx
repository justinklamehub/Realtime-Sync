export default function Slide02Uebersicht() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        2
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">2 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Projektüberblick
        </h1>
        <div className="flex-1 flex flex-col gap-[3vh]">
          <div className="flex gap-[3vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Zentrale Plattform</p>
              <p className="font-body text-[3vw] text-muted leading-relaxed">
                Speditions- und Lagerteams auf einer einheitlichen Oberfläche
              </p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Rollenbasierter Zugriff</p>
              <p className="font-body text-[3vw] text-muted leading-relaxed">
                7 Rollen, intern und extern, fein konfigurierbar
              </p>
            </div>
          </div>
          <div className="flex gap-[3vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Verladungen und Paletten</p>
              <p className="font-body text-[3vw] text-muted leading-relaxed">
                Vollständige Auftragssteuerung und Palettenkontenführung
              </p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Echtzeit-Updates</p>
              <p className="font-body text-[3vw] text-muted leading-relaxed">
                Änderungen sofort für alle Nutzer sichtbar über Socket.IO
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
