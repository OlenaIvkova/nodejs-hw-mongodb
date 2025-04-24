import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, '../../docs/openapi.yaml');

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(

      JSON.stringify(
        require('yaml').parse(fs.readFileSync(swaggerPath, 'utf8'))
      )
    );
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};