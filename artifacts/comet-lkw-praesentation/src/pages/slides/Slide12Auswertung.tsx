export default function Slide12Auswertung() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        12
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">12 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Auftragsauswertung
        </h1>
        <div className="flex-1 flex gap-[4vw]">
          <div className="flex-1 flex flex-col gap-[3vh] justify-center">
            <div className="flex items-start gap-[2.5vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">SAP-CSV-Import</p>
                <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Exportierte SAP-Dateien direkt hochladen und auswerten</p>
              </div>
            </div>
            <div className="flex items-start gap-[2.5vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Hierarchische Gliederung</p>
                <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Spedition → Liefertermin → Leitgebiet mit Palettenvolumen</p>
              </div>
            </div>
            <div className="flex items-start gap-[2.5vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Freigabesteuerung</p>
                <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Spedition sieht nur freigegebene Auswertungen</p>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-primary rounded-[1.5vw] px-[4vw] py-[4vh] flex flex-col justify-center gap-[3vh]">
            <p className="font-body font-medium text-[2.6vw] text-white opacity-60 uppercase tracking-widest">Ergebnis je Auswertung</p>
            <div className="flex flex-col gap-[2vh]">
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-[3.2vw] text-white">Spedition</p>
                <div className="h-[0.3vh] flex-1 mx-[2vw] bg-white opacity-20" />
                <p className="font-body text-[3vw] text-white opacity-60">Gesamtvolumen</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-[3.2vw] text-white">Liefertermin</p>
                <div className="h-[0.3vh] flex-1 mx-[2vw] bg-white opacity-20" />
                <p className="font-body text-[3vw] text-white opacity-60">Paletten je Tag</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-display font-bold text-[3.2vw] text-white">Leitgebiet</p>
                <div className="h-[0.3vh] flex-1 mx-[2vw] bg-white opacity-20" />
                <p className="font-body text-[3vw] text-white opacity-60">Paletten je Zone</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
