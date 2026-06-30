export default function Slide06Verladungen() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg font-body">
      <div className="absolute bottom-[5vh] right-[5vw] text-[12vw] font-display font-extrabold text-primary opacity-[0.04] leading-none select-none">
        6
      </div>
      <div className="absolute inset-0 flex flex-col px-[8vw] pt-[8vh] pb-[7vh]">
        <div className="flex items-center justify-between mb-[3vh]">
          <div className="w-[5vw] h-[0.5vh] bg-accent" />
          <span className="text-[2.4vw] font-body font-medium text-muted">6 / 17</span>
        </div>
        <h1 className="font-display font-extrabold text-[5vw] text-primary leading-tight tracking-tight mb-[4vh]">
          Verladungsverwaltung
        </h1>
        <div className="flex-1 flex flex-col gap-[3vh] justify-center">
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Zentrale Auftragsübersicht</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Alle LKW-Bewegungen in einer Tabelle — filterbar nach Status, LKW-Art, Tor und Datum</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Massenanlage und Vorlagen</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Mehrere Verladungen gleichzeitig anlegen, wiederkehrende Prozesse als Vorlage speichern</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Export und Auswertung</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">CSV- und Excel-Export der Verladungsdaten für externe Auswertungen</p>
            </div>
          </div>
          <div className="flex items-start gap-[2.5vw]">
            <div className="w-[1vw] h-[1vw] rounded-full bg-accent mt-[1.5vh] shrink-0" />
            <div>
              <p className="font-display font-bold text-[3.5vw] text-primary leading-tight">Echtzeit-Statusaktualisierung</p>
              <p className="font-body text-[3vw] text-muted mt-[0.5vh]">Statusänderungen werden sofort an alle angemeldeten Nutzer übertragen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
