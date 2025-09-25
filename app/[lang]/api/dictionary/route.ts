import { NextRequest, NextResponse } from 'next/server'
import { getDictionary } from '@/app/[lang]/dictionaries'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)


  const lang = !searchParams.get('locale') ? " " : searchParams.get('locale')

  // Validate if the lang is one of the allowed ones
  if (!['en', 'de', 'fa', 'ar'].includes(lang!)) {
    return NextResponse.json({ error: 'Unsupported locale' }, { status: 400 })
  }

  try {
    // Fetch the dictionary data
    const dictionary = await getDictionary(lang as 'en' | 'de' | 'fa' | 'ar')
    return NextResponse.json(dictionary)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load dictionary' }, { status: 500 })
  }
}