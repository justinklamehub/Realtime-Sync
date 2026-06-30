export default function Slide16Berechtigungen() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        16
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">16 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Berechtigungen und Rollensichtbarkeit
        </h1>
        <div className="flex-1 flex flex-col gap-[3vh] justify-center">
          <div className="flex gap-[3vw] items-center bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] overflow-hidden">
            <div className="w-[6vw] h-[6vw] rounded-[1.2vw] bg-accent flex items-center justify-center shrink-0">
              <div className="w-[3vw] h-[2.5vw] border-[0.5vw] border-white rounded-[0.4vw]" />
            </div>
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Sidebar frei konfigurierbar</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Jeder Menüpunkt für jede Rolle individuell ein- oder ausblendbar</p>
            </div>
          </div>
          <div className="flex gap-[3vw] items-center bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] overflow-hidden">
            <div className="w-[6vw] h-[6vw] rounded-[1.2vw] bg-card border-[0.2vw] border-primary border-opacity-15 flex items-center justify-center shrink-0">
              <div className="flex flex-col gap-[0.5vw]">
                <div className="w-[3vw] h-[0.5vw] rounded-full bg-primary" />
                <div className="w-[2vw] h-[0.5vw] rounded-full bg-accent" />
                <div className="w-[2.5vw] h-[0.5vw] rounded-full bg-primary opacity-50" />
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Unabhängige Sicherheitsschicht</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Sidebar-Konfiguration entkoppelt von der API-Zugriffskontrolle</p>
            </div>
          </div>
          <div className="flex gap-[3vw] items-center bg-primary rounded-[1.5vw] px-[3.5vw] py-[3vh] overflow-hidden">
            <div className="w-[6vw] h-[6vw] rounded-[1.2vw] bg-accent flex items-center justify-center shrink-0">
              <div className="flex gap-[0.6vw]">
                <div className="w-[1.4vw] h-[3vw] rounded-full bg-white" />
                <div className="w-[1.4vw] h-[2.2vw] rounded-full bg-white opacity-60" />
                <div className="w-[1.4vw] h-[2.6vw] rounded-full bg-white opacity-40" />
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Speditions-Freigabe</p>
              <p className="font-body text-[2.8vw] text-white opacity-70 mt-[0.4vh]">Admins schalten Unterauftragnehmer frei — ohne COMET-Eingriff</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
