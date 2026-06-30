export default function Slide10Paletten() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        10
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">10 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Palettenverwaltung
        </h1>
        <div className="flex-1 flex gap-[3vw]">
          <div className="flex-1 bg-primary rounded-[1.5vw] px-[3vw] py-[3vh] flex flex-col gap-[2vh]">
            <p className="font-body font-medium text-[2.6vw] text-white opacity-60 uppercase tracking-widest">Typ 1</p>
            <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Europaletten</p>
            <div className="h-[0.3vh] bg-white opacity-20" />
            <div className="flex flex-col gap-[1.5vh]">
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-white opacity-80">Eingang und Ausgang buchen</p>
              </div>
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-white opacity-80">Korrekturbuchungen möglich</p>
              </div>
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-white opacity-80">Jahresabschluss und Inventur</p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[3vh] flex flex-col gap-[2vh]">
            <p className="font-body font-medium text-[2.6vw] text-accent uppercase tracking-widest">Typ 2</p>
            <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Ladungssicherung</p>
            <div className="h-[0.3vh] bg-primary opacity-10" />
            <div className="flex flex-col gap-[1.5vh]">
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-muted">Separate Kontenführung</p>
              </div>
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-muted">Neutrale Buchungsart verfügbar</p>
              </div>
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-muted">Excel-Export je Periode</p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[3vh] flex flex-col gap-[2vh]">
            <p className="font-body font-medium text-[2.6vw] text-accent uppercase tracking-widest">Typ 3</p>
            <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Defekte Paletten</p>
            <div className="h-[0.3vh] bg-primary opacity-10" />
            <div className="flex flex-col gap-[1.5vh]">
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-muted">Erfassung beschädigter Ware</p>
              </div>
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-muted">Werkbestand-Tracking</p>
              </div>
              <div className="flex items-start gap-[1.5vw]">
                <div className="w-[0.7vw] h-[0.7vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
                <p className="font-body text-[2.8vw] text-muted">Auswertung nach Zeitraum</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
