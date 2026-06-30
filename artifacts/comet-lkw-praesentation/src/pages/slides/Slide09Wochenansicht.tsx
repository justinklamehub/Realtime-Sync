export default function Slide09Wochenansicht() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        9
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">9 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Wochenansicht
        </h1>
        <div className="flex-1 flex flex-col gap-[2vh] justify-center">
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Kalenderraster</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Alle Verladungen der Woche nach Wochentag</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Terminverschiebung per Drag und Drop</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Liefertermin durch Ziehen zwischen Tagen anpassen</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Ungeplante Verladungen</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Aufträge ohne Termin separat ausgewiesen</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Kalenderwochen-Navigation</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Schnelle Navigation zwischen beliebigen KWs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
