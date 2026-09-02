// Runs `expo run:android` with a JDK that Gradle and native modules accept.
//
// Usage:
//   npm run android
//   npm run android:device

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const MIN_MAJOR = 17;
const MAX_MAJOR = 21;

const runJava = (bin, args) => {
  const result = spawnSync(bin, args, { encoding: 'utf8' });

  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
};

const majorOf = (home) => {
  const text = runJava(join(home, 'bin', 'java'), ['-version']);
  const match = text.match(/version "(\d+)/);

  return match ? Number(match[1]) : null;
};

const javaHomeOnPath = () => {
  const text = runJava('java', ['-XshowSettings:properties', '-version']);
  const match = text.match(/java\.home = (.+)/);

  return match ? match[1].trim() : null;
};

const isSupported = (major) =>
  typeof major === 'number' && major >= MIN_MAJOR && major <= MAX_MAJOR;

const candidates = () => {
  const found = [];

  if (process.env.JAVA_HOME) {
    found.push(process.env.JAVA_HOME);
  }

  const onPath = javaHomeOnPath();

  if (onPath) {
    found.push(onPath);
  }

  for (const root of ['/usr/lib/jvm', '/Library/Java/JavaVirtualMachines']) {
    if (!existsSync(root)) {
      continue;
    }

    for (const entry of readdirSync(root).sort().reverse()) {
      const home = join(root, entry);

      found.push(
        existsSync(join(home, 'Contents', 'Home'))
          ? join(home, 'Contents', 'Home')
          : home
      );
    }
  }

  return found.filter((home) => existsSync(join(home, 'bin', 'java')));
};

const resolveJavaHome = () => {
  const seen = new Set();

  for (const home of candidates()) {
    if (seen.has(home)) {
      continue;
    }

    seen.add(home);

    const major = majorOf(home);

    if (isSupported(major)) {
      return { home, major };
    }
  }

  return null;
};

const soleAttachedDevice = () => {
  const result = spawnSync('adb', ['devices', '-l'], { encoding: 'utf8' });

  if (result.status !== 0) {
    return null;
  }

  const devices = (result.stdout ?? '')
    .split('\n')
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => /\sdevice(\s|$)/.test(line))
    .map((line) => {
      const model = line.match(/\bmodel:(\S+)/);

      return model ? model[1] : line.split(/\s+/)[0];
    });

  return devices.length === 1 ? devices[0] : null;
};

const forwardedArgs = () => {
  const args = process.argv.slice(2);
  const deviceIndex = args.indexOf('--device');

  if (deviceIndex === -1) {
    return args;
  }

  const next = args[deviceIndex + 1];

  if (next && !next.startsWith('-')) {
    return args;
  }

  const serial = soleAttachedDevice();

  if (!serial) {
    return args;
  }

  console.log(`Using the one attached device: ${serial}`);

  return [
    ...args.slice(0, deviceIndex + 1),
    serial,
    ...args.slice(deviceIndex + 1),
  ];
};

const picked = resolveJavaHome();

if (!picked) {
  console.error(
    `No JDK between ${MIN_MAJOR} and ${MAX_MAJOR} found. Install one or point ` +
      'JAVA_HOME at it, then run this again.'
  );
  process.exit(1);
}

console.log(`Using JDK ${picked.major} at ${picked.home}`);

const result = spawnSync('npx', ['expo', 'run:android', ...forwardedArgs()], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: { ...process.env, JAVA_HOME: picked.home },
});

process.exit(result.status ?? 1);
