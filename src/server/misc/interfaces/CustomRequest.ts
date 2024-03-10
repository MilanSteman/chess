import { Request } from 'express';

/**
 * Interface for a custom request
 */
interface CustomRequest extends Request {
  playerID?: string;
}

export { CustomRequest };