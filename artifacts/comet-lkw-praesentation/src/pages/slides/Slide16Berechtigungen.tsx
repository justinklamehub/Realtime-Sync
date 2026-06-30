export default function Slide16Berechtigungen() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        16
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">16 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Berechtigungen und Rollensichtbarkeit
        </h1>
        <div className="flex-1 flex flex-col gap-[3.5vh] justify-center">
          <div className="flex gap-[3vw]">
            <div className="w-[5.5vw] h-[5.5vw] rounded-[1.2vw] bg-accent flex items-center justify-center shrink-0">
              <div className="w-[2.5vw] h-[2vw] border-[0.4vw] border-white rounded-[0.3vw]" />
            </div>
            <div className="flex-1 flex flex-col gap-[0.8vh]">
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Sidebar-Sichtbarkeit frei konfigurierbar</p>
              <p className="font-body text-[3vw] text-muted">Jeder Menüpunkt kann für jede Rolle individuell ein- oder ausgeblendet werden — keine gesperrten Felder</p>
            </div>
          </div>
          <div className="flex gap-[3vw]">
            <div className="w-[5.5vw] h-[5.5vw] rounded-[1.2vw] bg-card flex items-center justify-center shrink-0">
              <div className="flex flex-col gap-[0.4vw]">
                <div className="w-[2.5vw] h-[0.4vw] rounded-full bg-primary" />
                <div className="w-[1.5vw] h-[0.4vw] rounded-full bg-accent" />
                <div className="w-[2vw] h-[0.4vw] rounded-full bg-primary" />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[0.8vh]">
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Unabhängige Sicherheitsschicht</p>
              <p className="font-body text-[3vw] text-muted">Sidebar-Konfiguration ist entkoppelt von der technischen Zugriffskontrolle — beides bleibt unabhängig wirksam</p>
            </div>
          </div>
          <div className="flex gap-[3vw]">
            <div className="w-[5.5vw] h-[5.5vw] rounded-[1.2vw] bg-card flex items-center justify-center shrink-0">
              <div className="flex gap-[0.5vw]">
                <div className="w-[1.2vw] h-[2.5vw] rounded-full bg-primary" />
                <div className="w-[1.2vw] h-[1.8vw] rounded-full bg-accent" />
                <div className="w-[1.2vw] h-[2vw] rounded-full bg-primary opacity-50" />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[0.8vh]">
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Speditions-Freigabe</p>
              <p className="font-body text-[3vw] text-muted">Speditions-Admins können Unterauftragnehmer für eigene Verladungen freischalten — ohne COMET-Eingriff</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
