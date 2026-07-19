import React, { useState, useRef } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import {
  FileText,
  User,
  UploadCloud,
  Sparkles,
  Info,
  Loader2,
} from 'lucide-react'
import UserMenu from '../../auth/components/UserMenu.jsx'

const MAX_CHARS = 5000

const Home = () => {
  const { loading, submitting, error, generateReport, reports } = useInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [fileName, setFileName] = useState('')
  const resumeInputRef = useRef()

  const navigate = useNavigate()

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0]
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    })
    if (data?._id) {
      navigate(`/interview/${data._id}`)
    }
  }

  if (loading) {
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

  return (
    <div className="aurora-bg relative flex min-h-screen w-full flex-col items-center gap-8 bg-page px-6 py-8">
      {/* Top bar */}
      <div className="flex w-full max-w-4xl items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
            style={{
              background:
                'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))',
            }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold text-ink">
            PrepAI
          </span>
        </div>

        <UserMenu />
      </div>

      {/* Page Header */}
      <header className="fade-in-up mt-2 max-w-lg text-center">
        <span className="glass mx-auto mb-4 flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-accent-alt">
          <Sparkles className="h-3 w-3" /> AI Interview Coach
        </span>
        <h1 className="font-display mb-2 text-3xl font-bold text-ink sm:text-4xl">
          Create Your Custom{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))',
            }}
          >
            Interview Plan
          </span>
        </h1>
        <p className="text-sm leading-relaxed text-muted">
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      {/* Main Card */}
      <div
        className="fade-in-up card w-full max-w-4xl overflow-hidden"
        style={{ animationDelay: '0.05s' }}
      >
        <div className="flex min-h-[420px] flex-col md:flex-row">
          {/* Left Panel - Job Description */}
          <div className="relative flex flex-1 flex-col gap-3 p-6">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex items-center text-accent">
                <FileText className="h-[18px] w-[18px]" />
              </span>
              <h2 className="flex-1 text-base font-semibold text-ink">
                Target Job Description
              </h2>
              <span className="rounded-md border border-accent/30 bg-accent/15 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-accent">
                Required
              </span>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="field h-full flex-1 resize-none leading-relaxed"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={MAX_CHARS}
            />
            <div className="pointer-events-none absolute bottom-8 right-8 text-xs text-muted">
              {jobDescription.length} / {MAX_CHARS} chars
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden w-px shrink-0 bg-line md:block" />

          {/* Right Panel - Profile */}
          <div className="flex flex-1 flex-col gap-3 p-6">
            <div className="mb-1 flex items-center gap-2">
              <span className="flex items-center text-accent">
                <User className="h-[18px] w-[18px]" />
              </span>
              <h2 className="flex-1 text-base font-semibold text-ink">
                Your Profile
              </h2>
            </div>

            {/* Upload Resume */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                Upload Resume
                <span className="rounded-md border border-accent/30 bg-accent/15 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-accent">
                  Best Results
                </span>
              </label>
              <label
                className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line bg-input px-4 py-6 text-center transition-colors hover:border-accent hover:bg-accent/5"
                htmlFor="resume"
              >
                <UploadCloud className="mb-1 h-7 w-7 text-accent" />
                <p className="m-0 text-sm font-medium text-ink">
                  {fileName || 'Click to upload or drag & drop'}
                </p>
                <p className="m-0 text-xs text-muted">PDF (Max 3MB)</p>
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                />
              </label>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="h-px flex-1 bg-line" />
              <span>OR</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            {/* Quick Self-Description */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-ink"
                htmlFor="selfDescription"
              >
                Quick Self-Description
              </label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                id="selfDescription"
                name="selfDescription"
                className="field h-24 resize-none leading-relaxed"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-2.5 rounded-xl border border-info/30 bg-info/10 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
              <p className="m-0 text-xs leading-relaxed text-info/90">
                Either a <strong className="text-ink">Resume</strong> or a{' '}
                <strong className="text-ink">Self Description</strong> is
                required to generate a personalized plan.
              </p>
            </div>

            {error && <p className="text-xs text-bad">{error}</p>}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between border-t border-line px-6 py-4">
          <span className="text-xs text-muted">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>
          <button
            onClick={handleGenerateReport}
            disabled={submitting}
            className="btn-primary"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {submitting ? 'Generating…' : 'Generate My Interview Strategy'}
          </button>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports.length > 0 && (
        <section
          className="fade-in-up w-full max-w-4xl"
          style={{ animationDelay: '0.1s' }}
        >
          <h2 className="mb-3 text-sm font-semibold text-muted">
            My Recent Interview Plans
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
            {reports.map((report) => (
              <li
                key={report._id}
                onClick={() => navigate(`/interview/${report._id}`)}
                className="card flex min-w-[220px] flex-1 cursor-pointer flex-col gap-1.5 p-4 transition-colors hover:border-accent/40"
              >
                <h3 className="m-0 truncate text-sm font-semibold text-ink">
                  {report.title || 'Untitled Position'}
                </h3>
                <p className="m-0 text-xs text-muted">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`m-0 text-xs font-semibold ${
                    report.matchScore >= 80
                      ? 'text-good'
                      : report.matchScore >= 60
                        ? 'text-warn'
                        : 'text-bad'
                  }`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Page Footer */}
      <footer className="flex gap-6 pt-2">
        <a
          href="#"
          className="text-xs text-muted transition-colors hover:text-ink"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="text-xs text-muted transition-colors hover:text-ink"
        >
          Terms of Service
        </a>
        <a
          href="#"
          className="text-xs text-muted transition-colors hover:text-ink"
        >
          Help Center
        </a>
      </footer>
    </div>
  )
}

export default Home
