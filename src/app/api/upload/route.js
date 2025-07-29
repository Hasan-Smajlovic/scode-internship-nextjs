import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function POST (request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const targetFolder = formData.get('targetFolder') || 'uploads'
    const fileName = formData.get('fileName') || file.name

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const publicDir = path.join(process.cwd(), 'public')
    const uploadDir = path.join(publicDir, targetFolder)

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, fileName)
    await fs.promises.writeFile(filePath, buffer)

    return NextResponse.json({
      success : true,
      path    : `/${targetFolder}/${fileName}`,
      fileName
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
