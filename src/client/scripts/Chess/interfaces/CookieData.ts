/**
 * Interface for cookie data
 */
interface CookieData {
  name: string;
  value: string;
  options?: {
    domain?: string;
    path?: string;
    secure?: boolean;
  };
}

export { CookieData };
