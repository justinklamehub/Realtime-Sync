export default function Slide08Kanban() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        8
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">8 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Kanban-Board
        </h1>
        <div className="flex-1 flex flex-col gap-[3vh]">
          <div className="flex gap-[2vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[2.5vw] py-[2.5vh] flex flex-col gap-[1.5vh]">
              <div className="flex items-center gap-[1.5vw]">
                <div className="w-[1vw] h-[1vw] rounded-full bg-muted shrink-0" />
                <p className="font-display font-bold text-[3.2vw] text-primary">Angemeldet</p>
              </div>
              <p className="font-body text-[2.8vw] text-muted leading-relaxed">Neu eingehende Verladungen, noch nicht bestätigt</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[2.5vw] py-[2.5vh] flex flex-col gap-[1.5vh]">
              <div className="flex items-center gap-[1.5vw]">
                <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
                <p className="font-display font-bold text-[3.2vw] text-primary">Angekommen</p>
              </div>
              <p className="font-body text-[2.8vw] text-muted leading-relaxed">LKW auf dem Gelände, Zuteilung zum Tor läuft</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[2.5vw] py-[2.5vh] flex flex-col gap-[1.5vh]">
              <div className="flex items-center gap-[1.5vw]">
                <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
                <p className="font-display font-bold text-[3.2vw] text-primary">in Verladung</p>
              </div>
              <p className="font-body text-[2.8vw] text-muted leading-relaxed">Aktiver Ladevorgang am Tor</p>
            </div>
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[2.5vw] py-[2.5vh] flex flex-col gap-[1.5vh]">
              <div className="flex items-center gap-[1.5vw]">
                <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
                <p className="font-display font-bold text-[3.2vw] text-white">Verladen</p>
              </div>
              <p className="font-body text-[2.8vw] text-white opacity-70 leading-relaxed">Bereit zur Abfertigung und Ausfahrt</p>
            </div>
          </div>
          <div className="bg-card rounded-[1.5vw] px-[3.5vw] py-[2.5vh] flex items-center gap-[4vw]">
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
              <p className="font-body text-[3vw] text-primary">Drag und Drop zwischen Spalten aktualisiert den Status in Echtzeit</p>
            </div>
            <div className="flex items-start gap-[1.5vw]">
              <div className="w-[0.8vw] h-[0.8vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
              <p className="font-body text-[3vw] text-primary">Ware-Status direkt inline bearbeitbar je Karte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
