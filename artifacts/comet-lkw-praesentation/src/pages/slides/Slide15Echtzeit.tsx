export default function Slide15Echtzeit() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        15
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">15 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Echtzeit und Sicherheit
        </h1>
        <div className="flex-1 flex flex-col gap-[2vh]">
          <div className="flex gap-[2.5vw] flex-1">
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Socket.IO</p>
              <p className="font-body text-[2.8vw] text-white opacity-70 leading-normal">Bidirektional · Statusänderungen live</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Session-Auth</p>
              <p className="font-body text-[2.8vw] text-muted leading-normal">express-session · PostgreSQL-Speicher</p>
            </div>
          </div>
          <div className="flex gap-[2.5vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Zugriffskontrolle</p>
              <p className="font-body text-[2.8vw] text-muted leading-normal">Jede Route durch Middleware geschützt</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Audit-Log</p>
              <p className="font-body text-[2.8vw] text-muted leading-normal">Alle Änderungen mit Zeitstempel und Nutzer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
