import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

interface SignPdfOptions {
  input: string
  output: string
  certificate: string
  certPassword: string
  javaOpts?: string[]
}

export async function signPdf({
  input,
  output,
  certificate,
  certPassword,
  javaOpts = [],
}: SignPdfOptions): Promise<void> {
  const jsignpdfPath = path.resolve(__dirname, 'jsignpdf/jsignpdf.jar')
  const javaCmd = process.env.JAVA_HOME
    ? path.join(process.env.JAVA_HOME, 'bin', 'java')
    : 'java'

  // 1. Caminhos absolutos
  const absoluteInput = path.resolve(input)
  const absoluteOutput = path.resolve(output)
  const absoluteCert = path.resolve(certificate)
  const outputDir = path.dirname(absoluteOutput)
  const jsignpdfOutput = path.join(
    outputDir,
    path.basename(absoluteInput).replace('.pdf', '_signed.pdf'),
  )

  // 2. Verificações iniciais
  if (!fs.existsSync(absoluteInput)) {
    throw new Error(`Arquivo de entrada não encontrado: ${absoluteInput}`)
  }

  if (!fs.existsSync(absoluteCert)) {
    throw new Error(`Certificado não encontrado: ${absoluteCert}`)
  }

  // 3. Comando de assinatura
  const command = [
    javaCmd,
    ...javaOpts,
    '-jar',
    `"${jsignpdfPath}"`,
    '-kst PKCS12',
    `-ksf "${absoluteCert}"`,
    `-ksp "${certPassword}"`,
    `-d "${outputDir}"`,
    `-dst "${jsignpdfOutput}"`,
    '-l2 "Assinado por LabMoura"',
    `"${absoluteInput}"`,
  ].join(' ')

  console.log('Executando comando de assinatura:')
  console.log(command)

  // 4. Execução do comando
  try {
    execSync(command, {
      stdio: 'inherit',
      windowsHide: true,
      timeout: 30000,
    })
  } catch (error) {
    if (!fs.existsSync(jsignpdfOutput)) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)

      throw new Error(`Falha na assinatura: ${errorMessage}`)
    }
    const warningMessage =
      error instanceof Error ? error.message : String(error)
    console.warn('Assinatura finalizada com warnings:', warningMessage)
  }

  // 5. Validação de saída
  if (!fs.existsSync(jsignpdfOutput)) {
    throw new Error('O arquivo assinado não foi gerado')
  }

  const fileSize = fs.statSync(jsignpdfOutput).size
  if (fileSize <= 0) {
    fs.unlinkSync(jsignpdfOutput)
    throw new Error('O arquivo assinado está vazio')
  }

  // 6. Substitui o output final, se necessário
  if (jsignpdfOutput !== absoluteOutput) {
    if (fs.existsSync(absoluteOutput)) {
      fs.unlinkSync(absoluteOutput)
    }
    fs.renameSync(jsignpdfOutput, absoluteOutput)
    console.log(`Arquivo final movido para: ${absoluteOutput}`)
  }

  console.log('✅ Assinatura digital concluída com sucesso!')
}
