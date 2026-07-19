import React, { useState } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import {
  Code2,
  MessageSquare,
  Milestone,
  ChevronDown,
  Download,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import UserMenu from '../../auth/components/UserMenu.jsx'

const NAV_ITEMS = [
  { id: 'technical', label: 'Technical Questions', icon: Code2 },
  { id: 'behavioral', label: 'Behavioral Questions', icon: MessageSquare },
  { id: 'roadmap', label: 'Road Map', icon: Milestone },
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-panel transition-colors hover:border-line/80">
      <div
        className="flex cursor-pointer select-none items-start gap-3 px-4 py-3.5"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="mt-0.5 shrink-0 rounded-md border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-[0.7rem] font-bold text-accent">
          Q{index + 1}
        </span>
        <p className="m-0 flex-1 text-sm font-medium leading-relaxed text-ink">
          {item.question}
        </p>
        <span
          className={`mt-0.5 shrink-0 text-muted transition-transform duration-200 ${
            open ? 'rotate-180 text-accent' : ''
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>
      {open && (
        <div className="fade-in flex flex-col gap-3 border-t border-line px-4 pb-4 pt-3">
          <div className="flex flex-col gap-1.5">
            <span className="w-fit rounded-md border border-purple/20 bg-purple/10 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-purple">
              Intention
            </span>
            <p className="m-0 text-[0.835rem] leading-relaxed text-muted">
              {item.intention}
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="w-fit rounded-md border border-good/20 bg-good/10 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-good">
              Model Answer
            </span>
            <p className="m-0 text-[0.835rem] leading-relaxed text-muted">
              {item.answer}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const RoadMapDay = ({ day }) => (
  <div className="relative flex flex-col gap-2 py-3 pl-14">
    <span
      className="absolute h-3.5 w-3.5 rounded-full border-2 border-accent bg-card"
      style={{ left: '21px', top: '1.05rem' }}
    />
    <div className="flex items-center gap-2.5">
      <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
        Day {day.day}
      </span>
      <h3 className="m-0 text-sm font-semibold text-ink">{day.focus}</h3>
    </div>
    <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
      {day.tasks.map((task, i) => (
        <li
          key={i}
          className="flex items-start gap-2 text-[0.845rem] leading-relaxed text-muted"
        >
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
          {task}
        </li>
      ))}
    </ul>
  </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
  const [activeNav, setActiveNav] = useState('technical')
  const { report, loading, downloadingPdf, getResumePdf } = useInterview()
  const { interviewId } = useParams()
  const navigate = useNavigate()

  if (loading || !report) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-page">
        <div className="flex flex-col items-center gap-3 text-muted">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <h1 className="text-sm font-medium text-ink">
            Loading your interview plan…
          </h1>
        </div>
      </main>
    )
  }

  const scoreTone =
    report.matchScore >= 80
      ? 'border-good'
      : report.matchScore >= 60
        ? 'border-warn'
        : 'border-bad'

  const scoreSub =
    report.matchScore >= 80
      ? 'Strong match for this role'
      : report.matchScore >= 60
        ? 'Decent match — a bit of prep will help'
        : 'Needs focused prep before applying'

  return (
    <div className="aurora-bg relative flex min-h-screen w-full flex-col items-center gap-4 bg-page p-4 sm:p-6">
      <div className="flex w-full max-w-6xl items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <UserMenu />
      </div>

      <div className="card mx-auto flex w-full max-w-6xl justify-between overflow-hidden">
        {/* ── Left Nav ── */}
        <nav className="flex w-[220px] shrink-0 flex-col justify-between gap-1 p-5">
          <div className="flex flex-col gap-1">
            <p className="mb-2 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-muted">
              Sections
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = activeNav === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-panel hover:text-ink'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => getResumePdf(interviewId)}
            disabled={downloadingPdf}
            className="btn-primary w-full"
          >
            {downloadingPdf ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            Download Resume
          </button>
        </nav>

        <div className="hidden w-px shrink-0 bg-line md:block" />

        {/* ── Center Content ── */}
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ maxHeight: 'calc(100vh - 3rem)' }}
        >
          {activeNav === 'technical' && (
            <section>
              <div className="mb-5 flex items-baseline gap-3 border-b border-line pb-4">
                <h2 className="m-0 text-[1.1rem] font-bold text-ink">
                  Technical Questions
                </h2>
                <span className="rounded-full border border-line bg-panel px-2.5 py-0.5 text-xs text-muted">
                  {report.technicalQuestions.length} questions
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'behavioral' && (
            <section>
              <div className="mb-5 flex items-baseline gap-3 border-b border-line pb-4">
                <h2 className="m-0 text-[1.1rem] font-bold text-ink">
                  Behavioral Questions
                </h2>
                <span className="rounded-full border border-line bg-panel px-2.5 py-0.5 text-xs text-muted">
                  {report.behavioralQuestions.length} questions
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {activeNav === 'roadmap' && (
            <section>
              <div className="mb-5 flex items-baseline gap-3 border-b border-line pb-4">
                <h2 className="m-0 text-[1.1rem] font-bold text-ink">
                  Preparation Road Map
                </h2>
                <span className="rounded-full border border-line bg-panel px-2.5 py-0.5 text-xs text-muted">
                  {report.preparationPlan.length}-day plan
                </span>
              </div>
              <div className="relative flex flex-col">
                <div
                  className="absolute bottom-0 top-0 w-0.5 rounded-full"
                  style={{
                    left: '28px',
                    background:
                      'linear-gradient(to bottom, var(--color-accent), transparent)',
                  }}
                />
                {report.preparationPlan.map((day) => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>
            </section>
          )}
        </main>

        <div className="hidden w-px shrink-0 bg-line md:block" />

        {/* ── Right Sidebar ── */}
        <aside className="hidden w-[240px] shrink-0 flex-col gap-5 p-5 md:flex">
          {/* Match Score */}
          <div className="flex flex-col items-center gap-2">
            <p className="m-0 self-start text-[0.75rem] font-semibold uppercase tracking-wider text-muted">
              Match Score
            </p>
            <div
              className={`flex h-[90px] w-[90px] flex-col items-center justify-center rounded-full border-4 ${scoreTone}`}
            >
              <span className="text-[1.6rem] font-extrabold leading-none text-ink">
                {report.matchScore}
              </span>
              <span className="-mt-0.5 text-xs text-muted">%</span>
            </div>
            <p className="m-0 text-center text-xs text-muted">{scoreSub}</p>
          </div>

          <div className="h-px bg-line" />

          {/* Skill Gaps */}
          <div className="flex flex-col gap-3">
            <p className="m-0 text-[0.75rem] font-semibold uppercase tracking-wider text-muted">
              Skill Gaps
            </p>
            <div className="flex flex-wrap gap-2">
              {report.skillGaps.map((gap, i) => {
                const sevClasses =
                  gap.severity === 'high'
                    ? 'text-bad border-bad/25 bg-bad/10'
                    : gap.severity === 'medium'
                      ? 'text-warn border-warn/25 bg-warn/10'
                      : 'text-good border-good/25 bg-good/10'
                return (
                  <span
                    key={i}
                    className={`rounded-md border px-2.5 py-1 text-[0.775rem] font-medium ${sevClasses}`}
                  >
                    {gap.skill}
                  </span>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Interview
