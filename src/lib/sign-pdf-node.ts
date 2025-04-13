import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'

export async function signPdf(
  input: string,
  output: string,
  certificate: string,
  certPassword: string,
  javaOpts: string[] = [],
): Promise<void> {
  const jsignpdfPath = path.resolve(__dirname, 'jsignpdf/jsignpdf.jar')
  const javaCmd = process.env.JAVA_HOME
    ? `${path.join(process.env.JAVA_HOME, 'bin', 'java')}`
    : 'java'

  // 1. Preparação de caminhos
  const absoluteInput = path.resolve(input)
  const absoluteOutput = path.resolve(output)
  const absoluteCert = path.resolve(certificate)
  const outputDir = path.dirname(absoluteOutput)
  const jsignpdfOutput = path.join(
    outputDir,
    path.basename(absoluteInput).replace('.pdf', '_signed.pdf'),
  )

  // 2. Verificação de pré-condições
  if (!fs.existsSync(absoluteInput)) {
    throw new Error(`Arquivo de entrada não encontrado: ${absoluteInput}`)
  }

  if (!fs.existsSync(absoluteCert)) {
    throw new Error(`Certificado não encontrado: ${absoluteCert}`)
  }

  // 3. Execução do comando
  const command = [
    javaCmd,
    ...javaOpts,
    '-jar',
    `"${jsignpdfPath}"`,
    '-kst PKCS12',
    `-ksf "${absoluteCert}"`,
    `-ksp "${certPassword}"`,
    `-d "${outputDir}"`,
    `-dst "${jsignpdfOutput}"`, // Usamos o padrão do jsignpdf aqui
    '-l2 "Assinado por LabMoura"',
    `"${absoluteInput}"`,
  ].join(' ')

  console.log('Executando comando de assinatura:', command)

  try {
    execSync(command, {
      stdio: 'inherit',
      windowsHide: true,
      timeout: 30000,
    })
  } catch (error) {
    if (!fs.existsSync(jsignpdfOutput)) {
      throw new Error(`Falha na assinatura: ${error.message}`)
    }
    console.warn('Assinatura concluída com warnings:', error.message)
  }

  // 4. Pós-processamento
  if (!fs.existsSync(jsignpdfOutput)) {
    throw new Error('Arquivo assinado não foi gerado')
  }

  // 5. Verificação básica da assinatura
  const fileSize = fs.statSync(jsignpdfOutput).size
  if (fileSize <= 0) {
    fs.unlinkSync(jsignpdfOutput)
    throw new Error('Arquivo assinado está vazio')
  }

  // 6. Renomeação (se necessário)
  if (jsignpdfOutput !== absoluteOutput) {
    // Remove o arquivo de destino se já existir
    if (fs.existsSync(absoluteOutput)) {
      fs.unlinkSync(absoluteOutput)
    }
    fs.renameSync(jsignpdfOutput, absoluteOutput)
    console.log(`Arquivo final movido para: ${absoluteOutput}`)
  }

  // 7. Verificação final
  if (!fs.existsSync(absoluteOutput)) {
    throw new Error('Arquivo assinado final não encontrado')
  }

  console.log('Assinatura concluída com sucesso em:', absoluteOutput)
}
