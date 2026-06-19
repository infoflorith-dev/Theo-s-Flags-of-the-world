import { useCallback, useEffect, useMemo, useState } from 'react'
import { countries } from './countries'
import './App.css'
import flagsBackground from './assets/flags-background.png'
const TOTAL_ROUNDS = 20
const ROUND_SECONDS = 10
const HIGH_SCORE_KEY = 'theos-flags-high-score'
const SURVIVAL_HIGH_SCORE_KEY = 'theos-flags-survival-high-score'
const GAMES_PLAYED_KEY = 'theos-flags-games-played'
const USA_HIGH_SCORE_KEY = 'theos-flags-usa-high-score'
function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}
const CONTINENTS = [
  {
    icon: '🌍',
    title: 'ALLES',
    subtitle: 'Alle continenten',
    value: 'all',
  },
  {
    icon: '🇪🇺',
    title: 'EUROPA',
    subtitle: 'Europese landen',
    value: 'Europa',
  },
  {
    icon: '🌍',
    title: 'AFRIKA',
    subtitle: 'Afrikaanse landen',
    value: 'Afrika',
  },
  {
    icon: '🌏',
    title: 'AZIË',
    subtitle: 'Aziatische landen',
    value: 'Azie',
  },
  {
    icon: '🌎',
    title: 'NOORD-AMERIKA',
    subtitle: 'Noord-Amerikaanse landen',
    value: 'Noord-Amerika',
  },
  {
    icon: '🌎',
    title: 'ZUID-AMERIKA',
    subtitle: 'Zuid-Amerikaanse landen',
    value: 'Zuid-Amerika',
  },
{
  icon: '🌊',
  title: 'OCEANIË',
  subtitle: 'Oceanische landen',
  value: 'Oceanie',
},
{
  icon: '🇺🇸',
  title: 'VS STATEN',
  subtitle: 'Amerikaanse staten',
  value: 'VS',
},
]

function getContinent(code) {
  const map = {
    nl: 'Europa', be: 'Europa', de: 'Europa', fr: 'Europa', es: 'Europa',
    it: 'Europa', gb: 'Europa', no: 'Europa', se: 'Europa', fi: 'Europa',
    dk: 'Europa', pl: 'Europa', pt: 'Europa', gr: 'Europa', ch: 'Europa',
    at: 'Europa', ie: 'Europa', is: 'Europa', lu: 'Europa', li: 'Europa',
    mc: 'Europa', sm: 'Europa', va: 'Europa', mt: 'Europa', cy: 'Europa',
    ee: 'Europa', lv: 'Europa', lt: 'Europa', by: 'Europa', ua: 'Europa',
    md: 'Europa', ro: 'Europa', bg: 'Europa', rs: 'Europa', me: 'Europa',
    ba: 'Europa', hr: 'Europa', si: 'Europa', sk: 'Europa', cz: 'Europa',
    hu: 'Europa', al: 'Europa', mk: 'Europa', ad: 'Europa',

    dz: 'Afrika', ao: 'Afrika', bj: 'Afrika', bw: 'Afrika', bf: 'Afrika',
    bi: 'Afrika', cm: 'Afrika', cv: 'Afrika', cf: 'Afrika', td: 'Afrika',
    km: 'Afrika', cg: 'Afrika', cd: 'Afrika', ci: 'Afrika', dj: 'Afrika',
    eg: 'Afrika', gq: 'Afrika', er: 'Afrika', sz: 'Afrika', et: 'Afrika',
    ga: 'Afrika', gm: 'Afrika', gh: 'Afrika', gn: 'Afrika', gw: 'Afrika',
    ke: 'Afrika', ls: 'Afrika', lr: 'Afrika', ly: 'Afrika', mg: 'Afrika',
    mw: 'Afrika', ml: 'Afrika', ma: 'Afrika', mr: 'Afrika', mu: 'Afrika',
    mz: 'Afrika', na: 'Afrika', ne: 'Afrika', ng: 'Afrika', rw: 'Afrika',
    st: 'Afrika', sn: 'Afrika', sc: 'Afrika', sl: 'Afrika', so: 'Afrika',
    za: 'Afrika', ss: 'Afrika', sd: 'Afrika', tz: 'Afrika', tg: 'Afrika',
    tn: 'Afrika', ug: 'Afrika', zm: 'Afrika', zw: 'Afrika',

    af: 'Azie', am: 'Azie', az: 'Azie', bh: 'Azie', bd: 'Azie', bt: 'Azie',
    bn: 'Azie', kh: 'Azie', cn: 'Azie', ge: 'Azie', in: 'Azie', id: 'Azie',
    ir: 'Azie', iq: 'Azie', il: 'Azie', jp: 'Azie', jo: 'Azie', kz: 'Azie',
    kw: 'Azie', kg: 'Azie', la: 'Azie', lb: 'Azie', my: 'Azie', mv: 'Azie',
    mn: 'Azie', mm: 'Azie', np: 'Azie', kp: 'Azie', om: 'Azie', pk: 'Azie',
    ps: 'Azie', ph: 'Azie', qa: 'Azie', sa: 'Azie', sg: 'Azie', kr: 'Azie',
    lk: 'Azie', sy: 'Azie', tj: 'Azie', th: 'Azie', tl: 'Azie', tr: 'Azie',
    tm: 'Azie', ae: 'Azie', uz: 'Azie', vn: 'Azie', ye: 'Azie',

    ca: 'Noord-Amerika', us: 'Noord-Amerika', mx: 'Noord-Amerika',
    bz: 'Noord-Amerika', cr: 'Noord-Amerika', sv: 'Noord-Amerika',
    gt: 'Noord-Amerika', hn: 'Noord-Amerika', ni: 'Noord-Amerika',
    pa: 'Noord-Amerika', ag: 'Noord-Amerika', bs: 'Noord-Amerika',
    bb: 'Noord-Amerika', cu: 'Noord-Amerika', dm: 'Noord-Amerika',
    do: 'Noord-Amerika', gd: 'Noord-Amerika', ht: 'Noord-Amerika',
    jm: 'Noord-Amerika', kn: 'Noord-Amerika', lc: 'Noord-Amerika',
    vc: 'Noord-Amerika', tt: 'Noord-Amerika',

    ar: 'Zuid-Amerika', bo: 'Zuid-Amerika', br: 'Zuid-Amerika',
    cl: 'Zuid-Amerika', co: 'Zuid-Amerika', ec: 'Zuid-Amerika',
    gy: 'Zuid-Amerika', py: 'Zuid-Amerika', pe: 'Zuid-Amerika',
    sr: 'Zuid-Amerika', uy: 'Zuid-Amerika', ve: 'Zuid-Amerika',

    au: 'Oceanie', fj: 'Oceanie', ki: 'Oceanie', mh: 'Oceanie',
    fm: 'Oceanie', nr: 'Oceanie', nz: 'Oceanie', pw: 'Oceanie',
    pg: 'Oceanie', sb: 'Oceanie', ws: 'Oceanie', to: 'Oceanie',
    tv: 'Oceanie', vu: 'Oceanie',
  }

  return map[code] || 'Overig'
}
const usaStates = [
  { code: 'us-al', name: 'Alabama' },
  { code: 'us-ak', name: 'Alaska' },
  { code: 'us-az', name: 'Arizona' },
  { code: 'us-ar', name: 'Arkansas' },
  { code: 'us-ca', name: 'California' },
  { code: 'us-co', name: 'Colorado' },
  { code: 'us-ct', name: 'Connecticut' },
  { code: 'us-de', name: 'Delaware' },
  { code: 'us-fl', name: 'Florida' },
  { code: 'us-ga', name: 'Georgia' },
  { code: 'us-hi', name: 'Hawaii' },
  { code: 'us-id', name: 'Idaho' },
  { code: 'us-il', name: 'Illinois' },
  { code: 'us-in', name: 'Indiana' },
  { code: 'us-ia', name: 'Iowa' },
  { code: 'us-ks', name: 'Kansas' },
  { code: 'us-ky', name: 'Kentucky' },
  { code: 'us-la', name: 'Louisiana' },
  { code: 'us-me', name: 'Maine' },
  { code: 'us-md', name: 'Maryland' },
  { code: 'us-ma', name: 'Massachusetts' },
  { code: 'us-mi', name: 'Michigan' },
  { code: 'us-mn', name: 'Minnesota' },
  { code: 'us-ms', name: 'Mississippi' },
  { code: 'us-mo', name: 'Missouri' },
  { code: 'us-mt', name: 'Montana' },
  { code: 'us-ne', name: 'Nebraska' },
  { code: 'us-nv', name: 'Nevada' },
  { code: 'us-nh', name: 'New Hampshire' },
  { code: 'us-nj', name: 'New Jersey' },
  { code: 'us-nm', name: 'New Mexico' },
  { code: 'us-ny', name: 'New York' },
  { code: 'us-nc', name: 'North Carolina' },
  { code: 'us-nd', name: 'North Dakota' },
  { code: 'us-oh', name: 'Ohio' },
  { code: 'us-ok', name: 'Oklahoma' },
  { code: 'us-or', name: 'Oregon' },
  { code: 'us-pa', name: 'Pennsylvania' },
  { code: 'us-ri', name: 'Rhode Island' },
  { code: 'us-sc', name: 'South Carolina' },
  { code: 'us-sd', name: 'South Dakota' },
  { code: 'us-tn', name: 'Tennessee' },
  { code: 'us-tx', name: 'Texas' },
  { code: 'us-ut', name: 'Utah' },
  { code: 'us-vt', name: 'Vermont' },
  { code: 'us-va', name: 'Virginia' },
  { code: 'us-wa', name: 'Washington' },
  { code: 'us-wv', name: 'West Virginia' },
  { code: 'us-wi', name: 'Wisconsin' },
  { code: 'us-wy', name: 'Wyoming' },
]
function createRounds(continent = 'all', mode = 'classic') {
  const pool =
 continent === 'VS'
  ? usaStates
      : continent === 'all'
        ? countries
        : countries.filter((country) => getContinent(country.code) === continent)
  const roundLimit = mode === 'survival' ? pool.length : TOTAL_ROUNDS

  return shuffle(pool)
    .slice(0, roundLimit)
    .map((country) => {
      const wrongAnswers = shuffle(
        pool.filter((candidate) => candidate.code !== country.code),
      ).slice(0, 3)

      return {
        country,
        answers: shuffle([country, ...wrongAnswers]),
      }
    })
}

function readStoredNumber(key) {
  const value = Number(localStorage.getItem(key))
  return Number.isFinite(value) ? value : 0
}

function FlagImage({ country }) {
  const [hasError, setHasError] = useState(false)

 const flagUrl = country.code.startsWith('us-')
  ? `https://flagcdn.com/${country.code}.svg`
  : `https://flagcdn.com/w640/${country.code}.png`

  if (hasError) {
    return (
      <div className="flag-fallback" role="img" aria-label={`Vlag van ${country.name}`}>
        Vlag niet beschikbaar
      </div>
    )
  }

  return (
    <img
      alt={`Vlag van ${country.name}`}
      className="flag-image"
      height="384"
      onError={() => setHasError(true)}
      src={flagUrl}
      width="640"
    />
  )
}

function App() {
  const [screen, setScreen] = useState('start')
  const [rounds, setRounds] = useState([])
  const [roundIndex, setRoundIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [score, setScore] = useState(0)
  const [selectedCode, setSelectedCode] = useState(null)
  const [roundResult, setRoundResult] = useState(null)
  const [highScore, setHighScore] = useState(() =>
    readStoredNumber(HIGH_SCORE_KEY),
  )
  const [survivalHighScore, setSurvivalHighScore] = useState(() =>
    readStoredNumber(SURVIVAL_HIGH_SCORE_KEY),
  )
  const [usaHighScore, setUsaHighScore] = useState(() =>
  readStoredNumber(USA_HIGH_SCORE_KEY),
)
  const [gamesPlayed, setGamesPlayed] = useState(() =>
    readStoredNumber(GAMES_PLAYED_KEY),
  )
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [gameMode, setGameMode] = useState('classic')
  const [hintsLeft, setHintsLeft] = useState(3)
  const [hiddenAnswerCodes, setHiddenAnswerCodes] = useState([])
  const currentRound = rounds[roundIndex]
  const isPlaying = screen === 'playing' && currentRound && !selectedCode

const progressText = useMemo(() => {
  if (gameMode === 'survival') {
    return `${roundIndex + 1}`
  }

  return `${Math.min(roundIndex + 1, TOTAL_ROUNDS)} van ${TOTAL_ROUNDS}`
}, [gameMode, roundIndex])

  function startGame() {
 setRounds(createRounds(selectedContinent, gameMode))
    setRoundIndex(0)
    setHintsLeft(3)
    setHiddenAnswerCodes([])
    setTimeLeft(ROUND_SECONDS)
    setScore(0)
    setSelectedCode(null)
    setRoundResult(null)
    setScreen('playing')
  }
function useHint() {
  if (
    gameMode !== 'survival' ||
    hintsLeft <= 0 ||
    !currentRound ||
    selectedCode
  ) {
    return
  }

  const wrongAnswers = currentRound.answers.filter(
    (answer) => answer.code !== currentRound.country.code
  )

  const answersToHide = shuffle(wrongAnswers)
    .slice(0, 2)
    .map((answer) => answer.code)

  setHiddenAnswerCodes(answersToHide)
  setHintsLeft((amount) => amount - 1)
}
 const finishGame = useCallback((finalScore) => {
  const survivalScore = gameMode === 'survival' ? roundIndex : 0
  const nextHighScore = Math.max(highScore, finalScore)
  const nextSurvivalHighScore = Math.max(survivalHighScore, survivalScore)
   const nextUsaHighScore =
  selectedContinent === 'VS'
    ? Math.max(usaHighScore, finalScore)
    : usaHighScore
  const nextGamesPlayed = gamesPlayed + 1

if (gameMode === 'classic') {
  if (selectedContinent === 'VS') {
    localStorage.setItem(
      USA_HIGH_SCORE_KEY,
      String(nextUsaHighScore)
    )
    setUsaHighScore(nextUsaHighScore)
  } else {
    localStorage.setItem(
      HIGH_SCORE_KEY,
      String(nextHighScore)
    )
    setHighScore(nextHighScore)
  }
}

  if (gameMode === 'survival') {
    localStorage.setItem(SURVIVAL_HIGH_SCORE_KEY, String(nextSurvivalHighScore))
    setSurvivalHighScore(nextSurvivalHighScore)
  }

  localStorage.setItem(GAMES_PLAYED_KEY, String(nextGamesPlayed))
  setGamesPlayed(nextGamesPlayed)
  setScreen('finished')
}, [
  gameMode,
  gamesPlayed,
  highScore,
  roundIndex,
  survivalHighScore,
  selectedContinent,
  usaHighScore,
])
  const goToNextRound = useCallback((nextScore = score) => {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      finishGame(nextScore)
      return
    }

    setRoundIndex((index) => index + 1)
    setTimeLeft(ROUND_SECONDS)
    setSelectedCode(null)
    setRoundResult(null)
  }, [finishGame, roundIndex, score])

  useEffect(() => {
    if (!isPlaying) return

    if (timeLeft === 0) {
      const timeout = window.setTimeout(goToNextRound, 1300)
      return () => window.clearTimeout(timeout)
    }

    const tick = window.setTimeout(() => {
      setTimeLeft((seconds) => {
        const nextSeconds = Math.max(0, seconds - 1)

      if (nextSeconds === 0) {
  setSelectedCode('timeout')
  setRoundResult('timeout')

  if (gameMode === 'survival') {
    window.setTimeout(() => finishGame(score), 1300)
  }
}

        return nextSeconds
      })
    }, 1000)

    return () => window.clearTimeout(tick)
}, [finishGame, gameMode, goToNextRound, isPlaying, score, timeLeft])

  function chooseAnswer(answer) {
    if (!currentRound || selectedCode) return

    const isCorrect = answer.code === currentRound.country.code
    const points = isCorrect ? timeLeft : -timeLeft
    const nextScore = score + points

    setSelectedCode(answer.code)
    setRoundResult(isCorrect ? 'correct' : 'wrong')
    setScore(nextScore)

if (gameMode === 'survival') {
  if (isCorrect) {
    window.setTimeout(() => goToNextRound(nextScore), 1300)
  } else {
    window.setTimeout(() => finishGame(nextScore), 1300)
  }
} else {
  window.setTimeout(() => goToNextRound(nextScore), 1300)
}
  }

  return (
    <main className="game-shell">
      <section className="game-card">
        {screen === 'start' && (
          <div className="start-screen">
              <div className="game-mode-picker">
  <button
    className={`mode-button ${gameMode === 'classic' ? 'active' : ''}`}
    onClick={() => setGameMode('classic')}
    type="button"
  >
    🎯 Klassiek
  </button>

  <button
  className={`mode-button ${gameMode === 'survival' ? 'active' : ''}`}
  onClick={() => setGameMode('survival')}
  disabled={selectedContinent === 'VS'}
  type="button"
>
  🔥 Survival
</button>
</div>
            <div className="continent-picker">
              {CONTINENTS.map((continent) => (
                <button
                  className={`continent-button ${
                    selectedContinent === continent.value ? 'active' : ''
                  }`}
                  key={continent.value}
                 onClick={() => {
  setSelectedContinent(continent.value)

  if (continent.value === 'VS') {
    setGameMode('classic')
  }
}}
                  type="button"
                >
                <>
  <div className="continent-icon">
    {continent.icon}
  </div>

  <div className="continent-title">
    {continent.title}
  </div>

  <div className="continent-subtitle">
    {continent.subtitle}
  </div>
</>
                </button>
              ))}
            </div>
    <div className="stats-row" aria-label="Highscores">
  <div>
    <span>🏆 Klassiek highscore</span>
    <strong>{highScore}</strong>
  </div>

  <div>
    <span>🔥 Survival record</span>
    <strong>{survivalHighScore}</strong>
  </div>

  <div>
    <span>🇺🇸 VS record</span>
    <strong>{usaHighScore}</strong>
  </div>

  <div>
    <span>🎮 Gespeelde spellen</span>
    <strong>{gamesPlayed}</strong>
  </div>
</div>

            <button className="primary-button" type="button" onClick={startGame}>
              Start
            </button>
          </div>
        )}

        {screen === 'playing' && currentRound && (
          <div className="play-screen">
            <header className="scoreboard">
              <div>
                <span>Vraag</span>
                <strong>{progressText}</strong>
              </div>
            <div className="timer" aria-label={`Nog ${timeLeft} seconden`}>
  {timeLeft}

 </div>
              <div>
                <span>Score</span>
                <strong>{score}</strong>
              </div>
            </header>

            <div className="flag-stage" aria-label="Welke vlag is dit?">
              <FlagImage country={currentRound.country} />
            </div>

            {roundResult && (
              <p className={`round-feedback ${roundResult}`}>
                {roundResult === 'correct' && 'Goed!'}
                {roundResult === 'wrong' && 'Fout.'}
                {roundResult === 'timeout' && 'Tijd voorbij.'} Juiste antwoord:{' '}
                <strong>{currentRound.country.name}</strong>
              </p>
            )}

            <div className="answers">
              {currentRound.answers.map((answer) => {
                const isSelected = selectedCode === answer.code
                const isCorrect = answer.code === currentRound.country.code
                const resultClass = selectedCode
                  ? isCorrect
                    ? 'correct'
                    : isSelected
                      ? 'wrong'
                      : ''
                  : ''

            if (hiddenAnswerCodes.includes(answer.code)) {
  return null
}

return (
  <button
    className={`answer-button ${resultClass}`}
    disabled={Boolean(selectedCode) || timeLeft === 0}
    key={answer.code}
    onClick={() => chooseAnswer(answer)}
                    type="button"
                  >
                    {answer.name}
                  </button>
                )
              })}
            </div>
       {gameMode === 'survival' && (
  <div className="hint-label">
  💡 Verwijder 2 foute antwoorden
</div>
    {Array.from({ length: hintsLeft }).map((_, index) => (
      <button
        className="hint-flag"
        key={index}
        disabled={Boolean(selectedCode)}
        onClick={useHint}
        type="button"
      >
     🇳🇱
      </button>
    ))}
  </div>
)}
          </div>
        )}

        {screen === 'finished' && (
          <div className="end-screen">
            <p className="eyebrow">Spel afgelopen</p>
           <h1>
  {gameMode === 'survival'
    ? `Survival score: ${roundIndex}`
    : `Eindscore: ${score}`}
</h1>
           <div className="stats-row">
  <div>
    <span>Klassiek highscore</span>
    <strong>{highScore}</strong>
  </div>

  <div>
    <span>Survival record</span>
    <strong>{survivalHighScore}</strong>
  </div>

  <div>
    <span>Gespeelde spellen</span>
    <strong>{gamesPlayed}</strong>
  </div>
</div>

          <div className="answers">
  <button
    className="primary-button"
    type="button"
    onClick={startGame}
  >
    Opnieuw spelen
  </button>

  <button
    className="primary-button"
    type="button"
    onClick={() => setScreen('start')}
  >
    Hoofdmenu
  </button>
</div>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
