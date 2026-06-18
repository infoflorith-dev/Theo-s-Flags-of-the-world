import { useCallback, useEffect, useMemo, useState } from 'react'
import { countries } from './countries'
import './App.css'

const TOTAL_ROUNDS = 20
const ROUND_SECONDS = 10
const HIGH_SCORE_KEY = 'theos-flags-high-score'
const GAMES_PLAYED_KEY = 'theos-flags-games-played'

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function createRounds() {
  return shuffle(countries)
    .slice(0, TOTAL_ROUNDS)
    .map((country) => {
      const wrongAnswers = shuffle(
        countries.filter((candidate) => candidate.code !== country.code),
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
  const [gamesPlayed, setGamesPlayed] = useState(() =>
    readStoredNumber(GAMES_PLAYED_KEY),
  )

  const currentRound = rounds[roundIndex]
  const isPlaying = screen === 'playing' && currentRound && !selectedCode

  const progressText = useMemo(
    () => `${Math.min(roundIndex + 1, TOTAL_ROUNDS)} van ${TOTAL_ROUNDS}`,
    [roundIndex],
  )

  function startGame() {
    setRounds(createRounds())
    setRoundIndex(0)
    setTimeLeft(ROUND_SECONDS)
    setScore(0)
    setSelectedCode(null)
    setRoundResult(null)
    setScreen('playing')
  }

  const finishGame = useCallback((finalScore) => {
    const nextHighScore = Math.max(highScore, finalScore)
    const nextGamesPlayed = gamesPlayed + 1

    localStorage.setItem(HIGH_SCORE_KEY, String(nextHighScore))
    localStorage.setItem(GAMES_PLAYED_KEY, String(nextGamesPlayed))

    setHighScore(nextHighScore)
    setGamesPlayed(nextGamesPlayed)
    setScreen('finished')
  }, [gamesPlayed, highScore])

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
        }

        return nextSeconds
      })
    }, 1000)

    return () => window.clearTimeout(tick)
  }, [goToNextRound, isPlaying, timeLeft])

  function chooseAnswer(answer) {
    if (!currentRound || selectedCode) return

    const isCorrect = answer.code === currentRound.country.code
    const points = isCorrect ? timeLeft : -timeLeft
    const nextScore = score + points

    setSelectedCode(answer.code)
    setRoundResult(isCorrect ? 'correct' : 'wrong')
    setScore(nextScore)

    window.setTimeout(() => goToNextRound(nextScore), 1300)
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

            <div className="stats-row" aria-label="Highscore">
              <div>
                <span>Highscore</span>
                <strong>{highScore}</strong>
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
            <h1>Eindscore: {score}</h1>

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

            <button className="primary-button" type="button" onClick={startGame}>
              Opnieuw spelen
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
