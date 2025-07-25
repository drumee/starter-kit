#!/usr/bin/env node
const { join } = require("path");
const { exit } = process;

const { sysEnv, subtleCrypto, Cache, Mariadb, uniqueId } = require("@drumee/server-essentials");

const Schema = require('./schema')
const { Organization, Drumate, Mfs } = require("@drumee/setup-schemas");


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
  let tpl = join(__dirname, 'asset', "welcome.html");
  console.log(`Cteating welcome file into ${out}`);
  Template.write({ link, domain }, { tpl, out });
  console.log("Congratulation! Your Drumee Starter Kit is ready. Open the link")
}

/**
 * 
 */
async function start() {
  new Cache();
  await Cache.load();
  const org = new Organization();
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
}

start()
  .then(() => {
    exit(0);
  })
  .catch((e) => {
    console.error(e);
    exit(1);
  });
