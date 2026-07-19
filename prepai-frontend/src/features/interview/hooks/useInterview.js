import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
} from '../services/interview.api'
import { useContext, useEffect, useState } from 'react'
import { InterviewContext } from '../interview-context'
import { useParams } from 'react-router'

export const useInterview = () => {
  const context = useContext(InterviewContext)
  const { interviewId } = useParams()

  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider')
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context

  const [submitting, setSubmitting] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [error, setError] = useState('')

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setSubmitting(true)
    setError('')
    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      })
      setReport(response.interviewReport)
      return response.interviewReport
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Could not generate the report. Try again.',
      )
      return null
    } finally {
      setSubmitting(false)
    }
  }

  const getReportById = async (id) => {
    setLoading(true)
    setError('')
    try {
      const response = await getInterviewReportById(id)
      setReport(response.interviewReport)
      return response.interviewReport
    } catch {
      setError('Could not load this report.')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getReports = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await getAllInterviewReports()
      setReports(response.interviewReports || [])
      return response.interviewReports
    } catch {
      setError('Could not load your reports.')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getResumePdf = async (interviewReportId) => {
    setDownloadingPdf(true)
    try {
      const response = await generateResumePdf({ interviewReportId })
      const url = window.URL.createObjectURL(
        new Blob([response], { type: 'application/pdf' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `resume_${interviewReportId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      setError('Could not generate the tailored resume PDF.')
    } finally {
      setDownloadingPdf(false)
    }
  }

  useEffect(() => {
    const loadReport = async () => {
      if (interviewId) {
        await getReportById(interviewId)
      } else {
        await getReports()
      }
    }

    void loadReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId])

  return {
    loading,
    submitting,
    downloadingPdf,
    error,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
  }
}
