export default function Slide11Abstimmungen() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        11
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">11 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Abstimmungen
        </h1>
        <div className="flex-1 flex flex-col gap-[2vh] justify-center">
          <div className="flex items-center gap-[3vw]">
            <div className="w-[5vw] h-[5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-[2.6vw] text-white">1</span>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2vh] overflow-hidden">
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Anlage</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">COMET erstellt Abstimmungsvorgang für Speditionspartner</p>
            </div>
          </div>
          <div className="flex items-center gap-[3vw]">
            <div className="w-[5vw] h-[5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-[2.6vw] text-white">2</span>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2vh] overflow-hidden">
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Partnereingabe</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Spedition trägt eigenen Palettenbestand ein</p>
            </div>
          </div>
          <div className="flex items-center gap-[3vw]">
            <div className="w-[5vw] h-[5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-[2.6vw] text-white">3</span>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2vh] overflow-hidden">
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Differenzprüfung</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">System berechnet Abweichungen — Klärung per Kommentar</p>
            </div>
          </div>
          <div className="flex items-center gap-[3vw]">
            <div className="w-[5vw] h-[5vw] rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-[2.6vw] text-white">4</span>
            </div>
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[3vw] py-[2vh] overflow-hidden">
              <p className="font-display font-bold text-[3.2vw] text-white leading-tight">Abschluss</p>
              <p className="font-body text-[2.8vw] text-white opacity-70 mt-[0.4vh]">Automatische Korrekturbuchung · Archivierung</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
