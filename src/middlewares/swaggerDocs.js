import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SWAGGER_PATH = path.join(__dirname, '..', '..', 'docs', 'swagger.json');

export const swaggerDocs = (req, res, next) => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH).toString());

    return swaggerUI.setup(swaggerDoc)(req, res, next);
  } catch {
    
    return next(createHttpError(500, "Can't load swagger docs"));
  }
};

export const swaggerServe = swaggerUI.serve;