export default function Slide15Echtzeit() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        15
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">15 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Echtzeit und Sicherheit
        </h1>
        <div className="flex-1 flex flex-col gap-[3vh]">
          <div className="flex gap-[3vw] flex-1">
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Socket.IO</p>
              <p className="font-body text-[3vw] text-white opacity-70 leading-relaxed">
                Bidirektionale Verbindung — Statusänderungen erreichen alle Nutzer in Echtzeit
              </p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Session-Authentifizierung</p>
              <p className="font-body text-[3vw] text-muted leading-relaxed">
                express-session mit PostgreSQL-Speicher — sichere serverseitige Sessions
              </p>
            </div>
          </div>
          <div className="flex gap-[3vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Rollenbasierte Zugriffskontrolle</p>
              <p className="font-body text-[3vw] text-muted leading-relaxed">
                Jede Route und jeder API-Endpunkt ist durch Middleware geschützt
              </p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <div className="w-[3vw] h-[0.4vh] bg-accent" />
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Audit-Log</p>
              <p className="font-body text-[3vw] text-muted leading-relaxed">
                Vollständige Nachvollziehbarkeit aller Systemänderungen mit Zeitstempel und Nutzer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
