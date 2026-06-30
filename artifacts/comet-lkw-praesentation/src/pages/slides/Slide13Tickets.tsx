export default function Slide13Tickets() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        13
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">13 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Ticketsystem
        </h1>
        <div className="flex-1 flex gap-[2.5vw]">
          <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[3vh] flex flex-col gap-[1.5vh] overflow-hidden">
            <p className="font-body font-medium text-[2.4vw] text-accent uppercase tracking-widest">Kategorien</p>
            <div className="h-[0.3vh] bg-primary opacity-10" />
            <div className="flex items-center gap-[2vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
              <p className="font-body text-[3vw] text-primary">Verladung</p>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
              <p className="font-body text-[3vw] text-primary">System</p>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
              <p className="font-body text-[3vw] text-primary">Sonstiges</p>
            </div>
          </div>
          <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[3vh] flex flex-col gap-[1.5vh] overflow-hidden">
            <p className="font-body font-medium text-[2.4vw] text-accent uppercase tracking-widest">Prioritäten</p>
            <div className="h-[0.3vh] bg-primary opacity-10" />
            <div className="flex items-center gap-[2vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-[#94A3B8] shrink-0" />
              <p className="font-body text-[3vw] text-primary">Niedrig</p>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-[#F59E0B] shrink-0" />
              <p className="font-body text-[3vw] text-primary">Mittel</p>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-[#F97316] shrink-0" />
              <p className="font-body text-[3vw] text-primary">Hoch</p>
            </div>
            <div className="flex items-center gap-[2vw]">
              <div className="w-[1vw] h-[1vw] rounded-full bg-[#EF4444] shrink-0" />
              <p className="font-body text-[3vw] text-primary">Kritisch</p>
            </div>
          </div>
          <div className="flex-1 bg-primary rounded-[1.5vw] px-[3vw] py-[3vh] flex flex-col gap-[1.5vh] overflow-hidden">
            <p className="font-body font-medium text-[2.4vw] text-white opacity-60 uppercase tracking-widest">Funktionen</p>
            <div className="h-[0.3vh] bg-white opacity-20" />
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1vh] shrink-0" />
              <p className="font-body text-[2.8vw] text-white opacity-80">Kommentarthreads</p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1vh] shrink-0" />
              <p className="font-body text-[2.8vw] text-white opacity-80">Verknüpfung mit Verladung</p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1vh] shrink-0" />
              <p className="font-body text-[2.8vw] text-white opacity-80">Status: Offen / Geschlossen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
