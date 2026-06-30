export default function Slide03Architektur() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        3
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">3 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Systemarchitektur
        </h1>
        <div className="flex-1 flex flex-col gap-[3vh]">
          <div className="flex gap-[3vw] flex-1">
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <p className="font-body font-medium text-[2.6vw] text-white opacity-60 uppercase tracking-widest">Backend</p>
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Express 5 + Drizzle ORM</p>
              <p className="font-body text-[3vw] text-white opacity-70">PostgreSQL · REST-API · Session-Auth</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <p className="font-body font-medium text-[2.6vw] text-accent uppercase tracking-widest">Frontend</p>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">React + Vite</p>
              <p className="font-body text-[3vw] text-muted">TanStack Query · Wouter · shadcn/ui</p>
            </div>
          </div>
          <div className="flex gap-[3vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <p className="font-body font-medium text-[2.6vw] text-accent uppercase tracking-widest">Echtzeit</p>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Socket.IO</p>
              <p className="font-body text-[3vw] text-muted">Bidirektionale Kommunikation · Live-Updates</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3.5vw] py-[3vh] flex flex-col justify-center gap-[1.5vh]">
              <p className="font-body font-medium text-[2.6vw] text-accent uppercase tracking-widest">Infrastruktur</p>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">pnpm Monorepo</p>
              <p className="font-body text-[3vw] text-muted">TypeScript · Drizzle Migrations · Shared Packages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
