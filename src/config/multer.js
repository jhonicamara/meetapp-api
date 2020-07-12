import multer from 'multer';
import crypto from 'crypto';

import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    // Aqui nos estamos determinando o diretorio aonde os arquivos
    // serao salvos
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),

    // Aqui nos vamos alterar o nome do arquivo
    filename: (require, file, callback) => {
      // Utilizando a dependencia crypto, que gerando um byte com 16
      // caracteres
      crypto.randomBytes(16, (error, response) => {
        if (error) return callback(error);
        // u11213as213123.png

        // Caso de certo, nos retornamos o arquivo com esse byte mais a
        // extensao do arquivo
        return callback(
          null,
          response.toString('hex') + extname(file.originalname)
        );
      });
    }
  })
};
