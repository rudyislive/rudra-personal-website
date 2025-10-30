import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readFileSync } from 'fs'
import { join } from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('adminToken')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const filePath = join(process.cwd(), 'content', 'resume.json')
    const current = JSON.parse(readFileSync(filePath, 'utf8'))

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are an assistant that improves resume content while keeping structure. Output ONLY valid JSON matching this TypeScript-like shape with the same keys and arrays, improving text quality, making bullets concise, impact-focused, and quantifiable where reasonable.\nSchema:\n{\n  name: string,\n  title: string,\n  email: string,\n  phone?: string,\n  location?: string,\n  summary: string,\n  experience: Array<{ company: string, position: string, startDate: string, endDate?: string, description: string[] }>,\n  education: Array<{ institution: string, degree: string, field: string, startDate: string, endDate?: string }>,\n  skills: string[]\n}\nHere is the current resume JSON:\n${JSON.stringify(current)}\nReturn only JSON, no commentary.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()

    let proposed
    try {
      proposed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'AI did not return valid JSON' }, { status: 500 })
    }

    return NextResponse.json({ proposedResume: proposed })
  } catch {
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 })
  }
}


