export default function Slide01Title() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative font-body"
      style={{ background: "linear-gradient(135deg, #F5F7FA 0%, #EBF0FA 100%)" }}
    >
      <div className="absolute -right-[8vw] -top-[15vh] w-[50vw] h-[50vw] rounded-full bg-accent opacity-5" />
      <div className="absolute -left-[6vw] -bottom-[15vh] w-[32vw] h-[32vw] rounded-full bg-primary opacity-5" />
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        1
      </div>
      <div className="absolute inset-0 flex flex-col justify-center pl-[10vw] pr-[22vw]">
        <div className="w-[6vw] h-[0.5vh] bg-accent mb-[4vh]" />
        <h1
          className="font-display font-extrabold text-[7.5vw] text-primary tracking-tighter leading-none mb-[2vh]"
          style={{ textWrap: "balance" }}
        >
          COMET LKW
        </h1>
        <h2
          className="font-display font-bold text-[4vw] text-accent tracking-tight leading-tight mb-[5vh]"
          style={{ textWrap: "balance" }}
        >
          Verladungsverwaltung
        </h2>
        <div className="w-[10vw] h-[0.3vh] bg-primary opacity-20 mb-[4vh]" />
        <p className="font-body font-medium text-[3vw] text-muted leading-relaxed">
          Internes Logistiksystem zur digitalen Steuerung
        </p>
        <p className="font-body font-medium text-[3vw] text-muted leading-relaxed">
          aller LKW-Verladungen, Speditionsaufträge und Palettenkonten
        </p>
        <p className="font-body text-[2.4vw] text-muted mt-[3vh] opacity-70">Stand: 2026</p>
      </div>
    </div>
  );
}
