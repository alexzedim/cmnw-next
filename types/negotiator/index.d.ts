declare module "negotiator" {
  type Headers = Record<string, string>;
  class Negotiator {
    constructor(request: { headers: Headers });
    languages(): string[];
  }
  export = Negotiator;
}
