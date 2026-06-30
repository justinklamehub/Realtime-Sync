export default function Slide07Status() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        7
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">7 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Statusverlauf einer Verladung
        </h1>
        <div className="flex-1 flex gap-[4vw]">
          <div className="flex flex-col gap-[2.5vh] justify-center flex-1">
            <div className="flex items-center gap-[2.5vw]">
              <div className="w-[5vw] h-[5vw] rounded-full bg-card border-[0.3vw] border-accent flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[2.5vw] text-accent">1</span>
              </div>
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-none">Angemeldet</p>
                <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">Fahrer registriert sich im System</p>
              </div>
            </div>
            <div className="ml-[2.5vw] w-[0.3vw] h-[3vh] bg-accent opacity-30" />
            <div className="flex items-center gap-[2.5vw]">
              <div className="w-[5vw] h-[5vw] rounded-full bg-card border-[0.3vw] border-accent flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[2.5vw] text-accent">2</span>
              </div>
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-none">Erwartet</p>
                <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">Ankunft wird geplant</p>
              </div>
            </div>
            <div className="ml-[2.5vw] w-[0.3vw] h-[3vh] bg-accent opacity-30" />
            <div className="flex items-center gap-[2.5vw]">
              <div className="w-[5vw] h-[5vw] rounded-full bg-card border-[0.3vw] border-accent flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[2.5vw] text-accent">3</span>
              </div>
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-none">Angekommen</p>
                <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">LKW ist auf dem Betriebsgelände</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[2.5vh] justify-center flex-1">
            <div className="flex items-center gap-[2.5vw]">
              <div className="w-[5vw] h-[5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[2.5vw] text-white">4</span>
              </div>
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-none">in Verladung</p>
                <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">Ladevorgang läuft</p>
              </div>
            </div>
            <div className="ml-[2.5vw] w-[0.3vw] h-[3vh] bg-accent opacity-30" />
            <div className="flex items-center gap-[2.5vw]">
              <div className="w-[5vw] h-[5vw] rounded-full bg-accent flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[2.5vw] text-white">5</span>
              </div>
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-none">Verladen</p>
                <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">Ware vollständig geladen</p>
              </div>
            </div>
            <div className="ml-[2.5vw] w-[0.3vw] h-[3vh] bg-accent opacity-30" />
            <div className="flex items-center gap-[2.5vw]">
              <div className="w-[5vw] h-[5vw] rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="font-display font-extrabold text-[2.5vw] text-white">6</span>
              </div>
              <div>
                <p className="font-display font-bold text-[3.5vw] text-primary leading-none">Abgefertigt</p>
                <p className="font-body text-[2.8vw] text-muted mt-[0.3vh]">LKW verlässt das Gelände</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-[3vh] flex items-center gap-[2vw]">
          <div className="h-[0.3vh] flex-1 bg-primary opacity-10" />
          <p className="font-body text-[2.8vw] text-muted shrink-0">Alternativ: Storniert — jederzeit bis zur Abfertigung möglich</p>
          <div className="h-[0.3vh] flex-1 bg-primary opacity-10" />
        </div>
      </div>
    </div>
  );
}
