export default function Slide03Architektur() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[4vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        3
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[7vh] pb-[6vh]">
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">3 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Systemarchitektur
        </h1>
        <div className="flex-1 flex flex-col gap-[2vh]">
          <div className="flex gap-[2.5vw] flex-1">
            <div className="flex-1 bg-primary rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <p className="font-body font-medium text-[2.4vw] text-white opacity-60 uppercase tracking-widest">Backend</p>
              <p className="font-display font-bold text-[3.5vw] text-white leading-tight">Express 5 + Drizzle ORM</p>
              <p className="font-body text-[2.8vw] text-white opacity-70">PostgreSQL · REST-API · Session-Auth</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <p className="font-body font-medium text-[2.4vw] text-accent uppercase tracking-widest">Frontend</p>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">React + Vite</p>
              <p className="font-body text-[2.8vw] text-muted">TanStack Query · Wouter · shadcn/ui</p>
            </div>
          </div>
          <div className="flex gap-[2.5vw] flex-1">
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <p className="font-body font-medium text-[2.4vw] text-accent uppercase tracking-widest">Echtzeit</p>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Socket.IO</p>
              <p className="font-body text-[2.8vw] text-muted">Bidirektional · Live-Updates · Events</p>
            </div>
            <div className="flex-1 bg-card rounded-[1.5vw] px-[3vw] py-[2.5vh] flex flex-col gap-[1vh] overflow-hidden">
              <p className="font-body font-medium text-[2.4vw] text-accent uppercase tracking-widest">Infrastruktur</p>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">pnpm Monorepo</p>
              <p className="font-body text-[2.8vw] text-muted">TypeScript · Drizzle Migrations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
