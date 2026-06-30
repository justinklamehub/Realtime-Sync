export default function Slide05Dashboard() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        5
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">5 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Dashboard
        </h1>
        <div className="flex-1 flex flex-col gap-[2vh]">
          <div className="flex gap-[2.5vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Betriebsübersicht</p>
              <p className="font-body text-[2.8vw] text-muted leading-normal">Verladungen, Tickets und KPIs auf einen Blick</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Tagesübersicht</p>
              <p className="font-body text-[2.8vw] text-muted leading-normal">Verladungsverteilung je Wochentag</p>
            </div>
          </div>
          <div className="flex gap-[2.5vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Wöchentlicher Bericht</p>
              <p className="font-body text-[2.8vw] text-muted leading-normal">Offene Vorgänge · Tickets · SAP-Status</p>
            </div>
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">SAP-Auswertung</p>
              <p className="font-body text-[2.8vw] text-white opacity-70 leading-normal">Aktuelle Auftragsanalyse im Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
