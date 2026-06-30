export default function Slide09Wochenansicht() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        9
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">9 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Wochenansicht
        </h1>
        <div className="flex-1 flex flex-col gap-[3vh] justify-center">
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Kalenderraster</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Alle Verladungen der laufenden Woche auf einen Blick — strukturiert nach Wochentag</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Terminverschiebung per Drag und Drop</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Liefertermin direkt durch Ziehen zwischen Tagen anpassen — Änderung wird sofort gespeichert</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Ungeplante Verladungen</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Aufträge ohne Liefertermin werden separat ausgewiesen und können von dort eingeplant werden</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Kalenderwochen-Navigation</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Schnelle Navigation zwischen beliebigen Kalenderwochen zur Vor- und Rückschau</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
