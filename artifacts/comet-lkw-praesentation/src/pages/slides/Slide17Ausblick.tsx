export default function Slide17Ausblick() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative font-body"
      style={{ background: "linear-gradient(135deg, #1B2B4B 0%, #1e3a6e 100%)" }}
    >
      <div className="absolute -right-[8vw] -bottom-[15vh] w-[50vw] h-[50vw] rounded-full bg-accent opacity-5" />
      <div className="absolute -left-[4vw] -top-[10vh] w-[28vw] h-[28vw] rounded-full bg-white opacity-3" />
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-white opacity-[0.04] leading-none select-none">
        17
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-white opacity-40">17 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-white leading-tight tracking-tight mb-[4vh]">
          Ausblick
        </h1>
        <div className="flex-1 flex flex-col gap-[3vh] justify-center">
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">SAP-Schnittstelle ausbauen</p>
              <p className="font-body text-[3vw] text-white opacity-60 mt-[0.5vh]">Direktanbindung an SAP statt manuellen CSV-Export — automatischer Datenaustausch</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Erweiterte Auswertungen</p>
              <p className="font-body text-[3vw] text-white opacity-60 mt-[0.5vh]">Zusätzliche Analysedimensionen und Dashboard-KPIs für Planungsprozesse</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Mobile-Optimierung weiterer Bereiche</p>
              <p className="font-body text-[3vw] text-white opacity-60 mt-[0.5vh]">Verladungs- und Palettenerfassung direkt am Mobilgerät für das Lager</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Neue Speditionspartner</p>
              <p className="font-body text-[3vw] text-white opacity-60 mt-[0.5vh]">Onboarding weiterer Speditionen — Rollensystem ist bereits auf Erweiterung ausgelegt</p>
            </div>
          </div>
        </div>
        <div className="mt-[3vh] flex items-center gap-[3vw]">
          <div className="h-[0.3vh] flex-1 bg-white opacity-15" />
          <p className="font-display font-bold text-[3vw] text-white opacity-40 shrink-0">COMET LKW-Verladungsverwaltung</p>
          <div className="h-[0.3vh] flex-1 bg-white opacity-15" />
        </div>
      </div>
    </div>
  );
}
