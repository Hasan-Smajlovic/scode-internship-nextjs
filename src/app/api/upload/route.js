import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

export async function POST (request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const targetFolder = formData.get('targetFolder') || 'uploads'
    const customFileName = formData.get('fileName')

    if (!file || typeof file.name !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid file' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const originalName = typeof customFileName === 'string' && customFileName.trim()
      ? customFileName
      : file.name

    const ext = path.extname(originalName)
    const base = path.basename(originalName, ext)
    const uniqueName = `${base}-${uuidv4()}${ext}`

    const uploadPath = path.resolve(process.cwd(), 'public', targetFolder)
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })

    const filePath = path.join(uploadPath, uniqueName)
    await fs.promises.writeFile(filePath, buffer)

    return NextResponse.json({
      success  : true,
      fileName : uniqueName,
      path     : `/${targetFolder}/${uniqueName}`
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
