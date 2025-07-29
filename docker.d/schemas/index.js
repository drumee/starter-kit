#!/usr/bin/env node
const { join } = require("path");
const { exit } = process;

const { sysEnv, subtleCrypto, Cache, Mariadb, Template} = require("@drumee/server-essentials");
const CREDENTIAL_DIR = "/etc/drumee/credential";
const publicKeyFile = join(CREDENTIAL_DIR, "crypto/public.pem");
const privateKeyFile = join(CREDENTIAL_DIR, "crypto/private.pem");

const Schema = require('./schema')
const { Organization, Mfs } = require("@drumee/setup-schemas");


const argparse = require("argparse");
const {
  PRIVATE_DOMAIN,
  PRIVATE_IP4,
  PUBLIC_DOMAIN,
  PUBLIC_IP4,
  PUBLIC_IP6,
} = process.env;

const parser = new argparse.ArgumentParser({
  description: "Drumee Starter Kit",
  add_help: true,
});


parser.add_argument("--localhost", {
  type: "int",
  default: 0,
  help: "If set, write minimal configs, no jitsi, no bind",
});

parser.add_argument("--http-port", {
  type: "int",
  default: 80,
  help: "If set, write minimal configs, no jitsi, no bind",
});

parser.add_argument("--https-port", {
  type: "int",
  default: 443,
  help: "If set, write minimal configs, no jitsi, no bind",
});


const args = parser.parse_args();

const yp = new Mariadb({ name: 'yp' });
/**
  *
  * @param {*} type
  */
function make_schema(type) {
  let script = join(__dirname, `templates`, `${type}.sql`);
  return new Promise((resolve, reject) => {
    const s = new Schema({
      folders: [],
      type,
      script,
      lang: "en",
      verbose: 0,
      yp,
    });
    let failed = function (e) {
      console.error(e);
      s.delete_entity();
      reject(e);
    };
    let check = function (ok) {
      if (!ok) {
        s.delete_entity();
        reject("Aborted");
        return;
      }
      s.destroy();
      console.log(`${type} seed completed from ${script}`);
      setTimeout(resolve, 500);
    };
    try {
      s.create_entity().then(check).catch(failed);
    } catch (e) {
      failed(e);
    }
  });
}

/**
 * 
 */
async function afterInstall(link, domain) {
  const { generateKeysPair } = subtleCrypto;
  const { writeFileSync } = require("fs");
  let args = await generateKeysPair();
  let { publicKey, privateKey } = args;
  let { data_dir } = sysEnv();
  writeFileSync(publicKeyFile, publicKey);
  writeFileSync(privateKeyFile, privateKey);
  let out = join(data_dir, 'tmp', "welcome.html");
  let tpl = join(__dirname, 'templates', "welcome.html");
  Template.write({ link, domain }, { tpl, out });
}

/**
 * 
 */
async function start() {
  new Cache();
  await Cache.load();
  const org = new Organization(args);
  await org.populate();
  for (let i = 0; i < 6; i++) {
    await make_schema('drumate')
  }
  for (let i = 0; i < 6; i++) {
    await make_schema('hub')
  }
  await org.createNobody();
  await org.createGuest();

  const { media, vhost } = await org.createSystemUser();
  const { reset_link, domain } = await org.createAdmin(media);
  let { db_name } = media;
  let mfs = new Mfs({ db_name, vhost });
  await mfs.importContent("content.drumee.com/Wallpapers",);
  await mfs.importTutorial();
  // /* TO DO: import or create robot.txt */
  await afterInstall(reset_link, domain)
  console.log(`
     **************************************************************************
    * Congratulation! Your Drumee Starter Kit is ready!
    * Start Drumee Server with command **npm run server.start**
    * Server started. Click on the link below to set you admin password
    * <a href="${reset_link}">Open this link to set the admin password</a>
     **************************************************************************
  `)
}

start()
  .then(() => {
    exit(0);
  })
  .catch((e) => {
    console.error(e);
    exit(1);
  });
