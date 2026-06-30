export default function Slide14Scanner() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        14
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">14 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Mobile Scanner
        </h1>
        <div className="flex-1 flex gap-[4vw]">
          <div className="flex-1 bg-primary rounded-[1.5vw] px-[4vw] py-[4vh] flex flex-col gap-[3vh]">
            <p className="font-body font-medium text-[2.6vw] text-white opacity-60 uppercase tracking-widest">QR-Scanner</p>
            <div className="flex flex-col gap-[2.5vh]">
              <div className="flex items-start gap-[2vw]">
                <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-white leading-tight">Mobiloptimierte Ansicht</p>
                  <p className="font-body text-[2.8vw] text-white opacity-60 mt-[0.3vh]">Klare Darstellung für Handy und Tablet</p>
                </div>
              </div>
              <div className="flex items-start gap-[2vw]">
                <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-white leading-tight">QR-Code-Zugriff</p>
                  <p className="font-body text-[2.8vw] text-white opacity-60 mt-[0.3vh]">Verladungsstatus direkt per Scan abrufen</p>
                </div>
              </div>
              <div className="flex items-start gap-[2vw]">
                <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-white leading-tight">Kein Login erforderlich</p>
                  <p className="font-body text-[2.8vw] text-white opacity-60 mt-[0.3vh]">Schnellzugriff für Lagermitarbeiter ohne Anmeldung</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-card rounded-[1.5vw] px-[4vw] py-[4vh] flex flex-col gap-[3vh]">
            <p className="font-body font-medium text-[2.6vw] text-accent uppercase tracking-widest">Gefahrgut</p>
            <div className="flex flex-col gap-[2.5vh]">
              <div className="flex items-start gap-[2vw]">
                <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Gefahrgut-Übersicht</p>
                  <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">Alle Gefahrgut-Verladungen auf einen Blick</p>
                </div>
              </div>
              <div className="flex items-start gap-[2vw]">
                <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Gefahrstoff-Informationen</p>
                  <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">UN-Nummern, Klassen und Sicherheitshinweise</p>
                </div>
              </div>
              <div className="flex items-start gap-[2vw]">
                <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
                <div>
                  <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Separater Zugangspunkt</p>
                  <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">Eigene Route /scanner/gefahrgut im System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
