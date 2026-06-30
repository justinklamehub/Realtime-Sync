export default function Slide11Abstimmungen() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        11
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">11 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Abstimmungen
        </h1>
        <div className="flex-1 flex flex-col gap-[2.5vh] justify-center">
          <div className="flex items-center gap-[3vw]">
            <div className="w-[5.5vw] h-[5.5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-[2.8vw] text-white">1</span>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2vh]">
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Anlage</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">COMET erstellt den Abstimmungsvorgang für einen Speditionspartner</p>
            </div>
          </div>
          <div className="flex items-center gap-[3vw]">
            <div className="w-[5.5vw] h-[5.5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-[2.8vw] text-white">2</span>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2vh]">
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Partnereingabe</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Spedition trägt eigenen Palettenbestand in das System ein</p>
            </div>
          </div>
          <div className="flex items-center gap-[3vw]">
            <div className="w-[5.5vw] h-[5.5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-[2.8vw] text-white">3</span>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2vh]">
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Differenzprüfung</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">System berechnet Abweichungen — Kommentare zur Klärung möglich</p>
            </div>
          </div>
          <div className="flex items-center gap-[3vw]">
            <div className="w-[5.5vw] h-[5.5vw] rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="font-display font-extrabold text-[2.8vw] text-white">4</span>
            </div>
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[3vw] py-[2vh]">
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Abschluss</p>
              <p className="font-body text-[3vw] text-white opacity-70 mt-[0.5vh]">Automatische Korrekturbuchung bei Differenzen — Abstimmung wird archiviert</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
