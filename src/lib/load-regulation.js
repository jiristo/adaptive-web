export const protocols = {
  tension: {
    eyebrow: 'Tělesné napětí',
    title: 'Zpomalte výdech',
    duration: 90,
    steps: [
      'Opřete chodidla o zem a nechte ramena klesnout.',
      'Nadechněte se nosem přibližně na 4 sekundy.',
      'Vydechněte jemně přibližně na 6 sekund. Nic netlačte.',
    ],
    safety: 'Pokud se vám začne motat hlava nebo se necítíte dobře, vraťte se k běžnému dechu a cvičení ukončete.',
  },
  thoughts: {
    eyebrow: 'Zahlcená hlava',
    title: 'Vraťte pozornost do přítomnosti',
    duration: 90,
    steps: [
      'Pomalu pojmenujte 3 věci, které právě vidíte.',
      'Všimněte si 2 zvuků, blízkých nebo vzdálených.',
      'Najděte 1 neutrální tělesný vjem, například kontakt chodidel se zemí.',
    ],
  },
  exhausted: {
    eyebrow: 'Nízká kapacita',
    title: 'Snižte nárok na nejbližší chvíli',
    duration: 90,
    steps: [
      'Opřete se a na chvíli přestaňte držet tělo silou.',
      'Povolte čelist, ramena a ruce tolik, kolik je příjemné.',
      'Vyberte jednu věc, kterou následujících 10 minut nemusíte řešit.',
    ],
  },
  priorities: {
    eyebrow: 'Nejasné priority',
    title: 'Zmenšete počet otevřených úkolů',
    duration: 90,
    steps: [
      'Vyberte jednu věc, kterou uděláte teď.',
      'Jednu další věc vědomě odložte na konkrétní čas.',
      'U jedné věci zvažte, zda ji můžete předat nebo požádat o pomoc.',
    ],
  },
};

export const actionLabels = {
  finish: 'Dokončím jednu konkrétní věc',
  postpone: 'Něco vědomě odložím',
  ask: 'Požádám o pomoc nebo úkol předám',
  pause: 'Dám si krátkou pauzu',
};

export function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function describeChange(before, after) {
  const start = Number(before);
  const end = Number(after);
  if (end < start) return 'Zátěž se po krátkém zastavení snížila.';
  if (end > start) return 'Zátěž je nyní vyšší. Není to selhání — zkuste snížit další nárok nebo oslovit člověka, kterému důvěřujete.';
  return 'Zátěž se nezměnila. Není to selhání — i krátké zastavení může pomoci zvolit lepší další krok.';
}

export function buildPlan({ before, after, action, detail = '' }) {
  const actionLabel = actionLabels[action] ?? actionLabels.pause;
  const cleanDetail = String(detail).trim();
  return {
    before: Number(before),
    after: Number(after),
    actionLabel,
    detail: cleanDetail,
    change: describeChange(before, after),
  };
}

