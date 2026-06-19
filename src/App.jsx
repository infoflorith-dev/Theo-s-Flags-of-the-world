import { useCallback, useEffect, useMemo, useState } from 'react'
import { countries } from './countries'
import './App.css'

const TOTAL_ROUNDS = 20
const ROUND_SECONDS = 10
const HIGH_SCORE_KEY = 'theos-flags-high-score'
const SURVIVAL_HIGH_SCORE_KEY = 'theos-flags-survival-high-score'
const GAMES_PLAYED_KEY = 'theos-flags-games-played'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

const CONTINENTS = [
  { label: '🌍 Alles', value: 'all' },
  { label: '🇪🇺 Europa', value: 'Europa' },
  { label: '🌍 Afrika', value: 'Afrika' },
  { label: '🌏 Azië', value: 'Azie' },
  { label: '🌎 Noord-Amerika', value: 'Noord-Amerika' },
  { label: '🌎 Zuid-Amerika', value: 'Zuid-Amerika' },
  { label: '🌊 Oceanië', value: 'Oceanie' },
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

function createRounds(continent = 'all', mode = 'classic') {
  const pool =
    continent === 'all'
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
  const flagUrl = `https://flagcdn.com/w640/${country.code}.png`

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
  const [gamesPlayed, setGamesPlayed] = useState(() =>
    readStoredNumber(GAMES_PLAYED_KEY),
  )
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [gameMode, setGameMode] = useState('classic')
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
    setTimeLeft(ROUND_SECONDS)
    setScore(0)
    setSelectedCode(null)
    setRoundResult(null)
    setScreen('playing')
  }

 const finishGame = useCallback((finalScore) => {
  const survivalScore = gameMode === 'survival' ? roundIndex : 0
  const nextHighScore = Math.max(highScore, finalScore)
  const nextSurvivalHighScore = Math.max(survivalHighScore, survivalScore)
  const nextGamesPlayed = gamesPlayed + 1

  if (gameMode === 'classic') {
    localStorage.setItem(HIGH_SCORE_KEY, String(nextHighScore))
    setHighScore(nextHighScore)
  }

  if (gameMode === 'survival') {
    localStorage.setItem(SURVIVAL_HIGH_SCORE_KEY, String(nextSurvivalHighScore))
    setSurvivalHighScore(nextSurvivalHighScore)
  }

  localStorage.setItem(GAMES_PLAYED_KEY, String(nextGamesPlayed))
  setGamesPlayed(nextGamesPlayed)
  setScreen('finished')
}, [gameMode, gamesPlayed, highScore, roundIndex, survivalHighScore])
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
            <p className="eyebrow">Vlaggenquiz</p>
            <h1>Theo&apos;s Flags of the World</h1>
            <p className="intro">
              Herken 20 vlaggen. Hoe sneller je goed antwoordt, hoe meer
              punten je pakt.
            </p>
            <div className="continent-picker">
  <button
    className={`continent-button ${gameMode === 'classic' ? 'active' : ''}`}
    onClick={() => setGameMode('classic')}
    type="button"
  >
    🎯 Klassiek
  </button>

  <button
    className={`continent-button ${gameMode === 'survival' ? 'active' : ''}`}
    onClick={() => setGameMode('survival')}
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
                  onClick={() => setSelectedContinent(continent.value)}
                  type="button"
                >
                  {continent.label}
                </button>
              ))}
            </div>
           <div className="stats-row" aria-label="Highscores">
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
                <span>Highscore</span>
                <strong>{highScore}</strong>
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
