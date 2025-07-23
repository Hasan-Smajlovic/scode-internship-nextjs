import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function POST (request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const targetFolder = formData.get('targetFolder') || 'uploads'

    if (!file) {
      return NextResponse.json({
        success : false,
        error   : 'File is not provided here'
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`

    const publicDir = path.join(process.cwd(), 'public')
    const uploadDir = path.join(publicDir, targetFolder)
    console.log('Creating directory:', uploadDir)

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
      console.log('Directory created:', uploadDir)
    }

    const filePath = path.join(uploadDir, fileName)
    console.log('Saving file to:', filePath)
    await fs.promises.writeFile(filePath, buffer)

    return NextResponse.json({
      success : true,
      message : 'File uploaded successfully',
      path    : `/${targetFolder}/${fileName}`,
      fileName
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success : false,
      error   : 'File upload failed: ' + error.message
    }, { status: 500 })
  }
}
