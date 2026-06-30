import truckImg from "@assets/stock_images/truck-loading-dock.jpg";

export default function Slide01Title() {
  return (
    <div className="w-screen h-screen overflow-hidden relative font-body flex">
      <div
        className="w-[56vw] h-screen flex flex-col justify-center pl-[8vw] pr-[4vw] relative"
        style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #EBF0FA 100%)" }}
      >
        <div className="absolute bottom-[5vh] right-[3vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
          1
        </div>
        <div className="w-[6vw] h-[0.5vh] bg-accent mb-[4vh]" />
        <h1 className="font-display font-extrabold text-[7vw] text-primary tracking-tighter leading-none mb-[2vh]">
          COMET LKW
        </h1>
        <h2 className="font-display font-bold text-[3.8vw] text-accent tracking-tight leading-tight mb-[4vh]">
          Verladungsverwaltung
        </h2>
        <div className="w-[8vw] h-[0.3vh] bg-primary opacity-20 mb-[3.5vh]" />
        <p className="font-body font-medium text-[2.8vw] text-muted leading-normal">
          Digitale Steuerung aller LKW-Verladungen
        </p>
        <p className="font-body font-medium text-[2.8vw] text-muted leading-normal">
          für Speditions- und Lagerteams
        </p>
        <p className="font-body text-[2.4vw] text-muted mt-[3vh] opacity-70">Stand: 2026</p>
      </div>
      <div className="flex-1 h-screen relative overflow-hidden">
        <img
          src={truckImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary opacity-30" />
        <div className="absolute left-0 top-0 bottom-0 w-[4vw] bg-gradient-to-r from-bg to-transparent" style={{ background: "linear-gradient(to right, #EBF0FA, transparent)" }} />
      </div>
    </div>
  );
}
