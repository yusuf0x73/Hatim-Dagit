//                                     BİSMİLLAHİRRAHMANİRRAHİM

const fs = require ('fs');
const path = require ('path');

const root = path.join (__dirname, '..', '..');

// .env.development.local: yerel geliştirmenin hangi veritabanına ve hangi sunucu fonksiyonlarına bağlandığı
const readEnv = file => {
  const env = {};
  if (!fs.existsSync (file)) return env;
  fs.readFileSync (file, 'utf8').split ('\n').forEach (line => {
    const match = line.match (/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2];
  });
  return env;
};

const env = readEnv (path.join (root, '.env.development.local'));

const TEST_DB = 'https://hatim-dagit-test-default-rtdb.europe-west1.firebasedatabase.app';
const PROD_DB = 'https://hatim-dagit-default-rtdb.asia-southeast1.firebasedatabase.app';

/*
  test: hatim-dagit-test veritabanı (REACT_APP_dev=true, Firebase ayarları .env.development.local'da)
  prod: canlı veritabanı (REACT_APP_dev=false, Firebase ayarları .env'den). Testler yalnızca kendi açtıkları
        "E2E" hatimlerine yazar, koşu sonunda bunlar silinir; var olan hatimler yalnızca okunur.
*/
const target = env.REACT_APP_dev === 'true' && (env.REACT_APP_databaseURL || '').includes ('hatim-dagit-test') ? 'test'
  : env.REACT_APP_dev === 'false' ? 'prod' : null;

const config = {
  target,
  appUrl: process.env.E2E_APP_URL || 'http://127.0.0.1:3123',
  functionsUrl: env.REACT_APP_sFunctionsUrl || 'http://localhost:8888',
  databaseUrl: target === 'test' ? TEST_DB : PROD_DB,
  outDir: path.join (__dirname, '..', 'out'),
  createdFile: path.join (__dirname, '..', 'out', 'created-keys.json'),
  // Bunlardan birine bağlantı görülürse test anında durur. Prod modunda da canlı sunucu fonksiyonlarına
  // gidilmez: test edilen, yereldeki (yeni) sunucu kodudur.
  forbiddenHosts: target === 'test' ? ['hatim-dagit-default-rtdb', 'sfunction.hatimdagit.com'] : ['sfunction.hatimdagit.com'],
};

const guardTarget = () => {
  if (!config.target) {
    throw new Error ('.env.development.local ne test (REACT_APP_dev=true + hatim-dagit-test) ne de prod (REACT_APP_dev=false) gösteriyor; e2e çalıştırılmadı.');
  }
  if (!/localhost|127\.0\.0\.1/.test (config.functionsUrl)) {
    throw new Error ('REACT_APP_sFunctionsUrl yerel netlify dev değil; e2e çalıştırılmadı.');
  }
};

module.exports = {config, guardTarget};
