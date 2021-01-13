import { hash, compare } from 'bcryptjs'

export class HashProvider {
  public async generateHash(payload: string): Promise<string> {
    const cryptoPassword = await hash(payload, 10);
    return cryptoPassword;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const payloadMatched = await compare(payload, hashed);
    return payloadMatched;
  }
}
