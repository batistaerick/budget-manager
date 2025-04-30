export async function hashPassword(password: string): Promise<string> {
  const SALT: string | undefined = process.env.PASSWORD_SALT;

  if (!SALT) {
    throw new Error('SALT environment is required');
  }
  const encoder = new TextEncoder();
  const key: CryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedKey: ArrayBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(SALT),
      iterations: 50000,
      hash: 'SHA-256',
    },
    key,
    256
  );
  return Buffer.from(derivedKey).toString('hex');
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const hash: string = await hashPassword(password);
  return hash === hashedPassword;
}
