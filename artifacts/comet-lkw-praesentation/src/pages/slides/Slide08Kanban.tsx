export default function Slide08Kanban() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        8
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">8 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Kanban-Board
        </h1>
        <div className="flex-1 flex flex-col gap-[2vh]">
          <div className="flex gap-[2vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[2.5vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="flex items-center gap-[1.5vw]">
                <div className="w-[1vw] h-[1vw] rounded-full bg-muted shrink-0" />
                <p className="font-display font-bold text-[3vw] text-primary">Angemeldet</p>
              </div>
              <p className="font-body text-[2.6vw] text-muted leading-normal">Eingehend · noch nicht bestätigt</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[2.5vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="flex items-center gap-[1.5vw]">
                <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
                <p className="font-display font-bold text-[3vw] text-primary">Angekommen</p>
              </div>
              <p className="font-body text-[2.6vw] text-muted leading-normal">Auf dem Gelände · Tor-Zuteilung</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[2.5vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="flex items-center gap-[1.5vw]">
                <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
                <p className="font-display font-bold text-[3vw] text-primary">in Verladung</p>
              </div>
              <p className="font-body text-[2.6vw] text-muted leading-normal">Aktiver Ladevorgang am Tor</p>
            </div>
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[2.5vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="flex items-center gap-[1.5vw]">
                <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
                <p className="font-display font-bold text-[3vw] text-white">Verladen</p>
              </div>
              <p className="font-body text-[2.6vw] text-white opacity-70 leading-normal">Bereit zur Abfertigung</p>
            </div>
          </div>
          <div className="flex gap-[2vw] flex-1 max-h-[30vh]">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex items-center gap-[2vw] overflow-hidden">
              <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
              <p className="font-body text-[2.8vw] text-primary">Drag und Drop zwischen Spalten aktualisiert den Status sofort</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex items-center gap-[2vw] overflow-hidden">
              <div className="w-[1vw] h-[1vw] rounded-full bg-accent shrink-0" />
              <p className="font-body text-[2.8vw] text-primary">Ware-Status direkt inline je Karte bearbeitbar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
