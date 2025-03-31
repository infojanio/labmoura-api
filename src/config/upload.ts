import crypto from 'crypto'
import multer from 'multer'
import path from 'path'

export default {
  upload(folder: string) {
    const tmpFolder = path.resolve(__dirname, '..', '..', folder) //salva sempre na pasta tmp

    return {
      directory: tmpFolder,

      storage: multer.diskStorage({
        destination: tmpFolder,

        //garante que o nome do arquivo nao será igual
        filename(request, file, callback) {
          const fileHash = crypto.randomBytes(10).toString('hex')
          const fileName = `${fileHash}-${file.originalname}`

          return callback(null, fileName)
        },
      }),
    }
  },
}
