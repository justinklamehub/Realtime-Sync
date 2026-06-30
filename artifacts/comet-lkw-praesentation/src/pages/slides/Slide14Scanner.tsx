import warehouseImg from "@assets/stock_images/warehouse-mobile.jpg";

export default function Slide14Scanner() {
  return (
    <div className="w-screen h-screen overflow-hidden relative font-body flex">
      <div className="flex-1 h-screen relative overflow-hidden">
        <img
          src={warehouseImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary opacity-40" />
        <div className="absolute right-0 top-0 bottom-0 w-[4vw]" style={{ background: "linear-gradient(to right, transparent, #F5F7FA)" }} />
      </div>
      <div className="w-[55vw] h-screen flex flex-col px-[6vw] pt-[7vh] pb-[6vh] bg-bg relative overflow-hidden">
        <div className="absolute bottom-[4vh] right-[4vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
          14
        </div>
        <div className="flex items-center justify-between mb-[2.5vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">14 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[3vh]">
          Mobile Scanner
        </h1>
        <div className="flex-1 flex flex-col gap-[2.5vh] justify-center">
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Mobiloptimierte Ansicht</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Klare Darstellung für Handy und Tablet</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">QR-Code-Zugriff</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Verladungsstatus direkt per Scan abrufen</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Kein Login erforderlich</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">Schnellzugriff für Lagermitarbeiter</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.2vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.2vw] text-primary leading-tight">Gefahrgut-Bereich</p>
              <p className="font-body text-[2.8vw] text-muted mt-[0.4vh]">UN-Nummern, Klassen und Hinweise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
