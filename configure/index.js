#!/usr/bin/env node

const { join, resolve, dirname } = require("path");
const { isString, isEmpty, template } = require("lodash");
const { exit } = process;
// const { loadSysEnv, sysEnv, uniqueId } = require("@drumee/server-essentials");
const { totalmem, userInfo } = require('os');
const {
  existsSync, close, writeSync, openSync, readFileSync, mkdirSync
} = require("fs");


const argparse = require("argparse");
const {
  PRIVATE_DOMAIN,
  PRIVATE_IP4,
  PUBLIC_DOMAIN,
  PUBLIC_IP4,
  PUBLIC_IP6,
  HTTP_PORT,
  HTTPS_PORT,
  FORCE_INSTALL,
} = process.env;

const parser = new argparse.ArgumentParser({
  description: "Drumee Starter Kit",
  add_help: true,
});

parser.add_argument("--endpoint", {
  type: String,
  default: 'main',
  help: "Server endpoint path",
});

parser.add_argument("--public-domain", {
  type: String,
  default: PUBLIC_DOMAIN,
  help: "Public domain name",
});

parser.add_argument("--private-domain", {
  type: String,
  default: PRIVATE_DOMAIN,
  help: "Private domain name",
});

parser.add_argument("--local-domain", {
  type: String,
  default: PRIVATE_DOMAIN,
  help: "",
});

parser.add_argument("--public-ip4", {
  type: String,
  default: PUBLIC_IP4,
  help: "Public IPV4",
});

parser.add_argument("--public-ip6", {
  type: String,
  default: PUBLIC_IP6,
  help: "Public IPV6",
});

parser.add_argument("--private-ip4", {
  type: String,
  default: PRIVATE_IP4,
  help: "Private IPV4",
});

parser.add_argument("--envfile", {
  type: String,
  help: "Dataset required to install Drumee",
});

parser.add_argument("--hostname", {
  type: String,
  default: "starter-kit",
  help: "Container hostname",
});

parser.add_argument("--container-name", {
  type: String,
  default: "starter-kit",
  help: "Container name",
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

parser.add_argument("--storage-dir", {
  type: String,
  default: 'storage',
  help: "Partition or directory dedicated to store drumee filesystem and databases",
});

// parser.add_argument("--data-dir", {
//   type: String,
//   default: 'storage/data',
//   help: "Partition or directory dedicated to store drumee data",
// });

// parser.add_argument("--db-dir", {
//   type: String,
//   default: 'storage/db',
//   help: "Partition or directory dedicated to store drumee database",
// });

parser.add_argument("--share-home", {
  type: 'int',
  default: 1,
  help: "If set, mount your home directory within the container on readonly mode",
});


parser.add_argument("--runtime-dir", {
  type: String,
  default: "runtime",
  help: "Drumee runtime dir",
});


const args = parser.parse_args();


/**
 * 
 * @param {*} err 
 */
function __error(err) {
  if (err) throw err;
};


/**
 * 
 */
function makedir(dname) {
  if (!existsSync(dname)) {
    mkdirSync(dname, { recursive: true });
  }
};

/**
 * 
 */
function render(data, tpl, parse) {
  if (!existsSync(tpl)) {
    console.error(`Template file not found ${tpl}`)
    return ""
  }
  let str = readFileSync(tpl);

  try {
    let res = template(String(str).toString())(data);
    if (parse && typeof res === "string") {
      return JSON.parse(res);
    }
    return res;
  } catch (e) {
    console.error(`Failed to render from template ${tpl}`);
    console.error("------------\n", e);
  }
};

/**
 *
 * @param {*} data
 * @param {*} fn
 * @param {*} tpl_name
 * @param {*} chr
 * @returns
 */
function write(data, opt) {
  let { outfile, template } = opt;
  makedir(dirname(outfile));
  let d = new Date();
  data.date = d.toISOString().split('T')[0];

  let fd = openSync(outfile, "w+");

  console.log("Writing config into " + outfile);
  if (isEmpty(template)) {
    writeSync(fd, data);
  } else {
    writeSync(fd, render(data, template));
  }
  close(fd, __error);
}



/***
 * 
 */
function writeTemplates(data, targets) {
  for (let target of targets) {
    try {
      if (isString(target)) {
        write(data, { template: target, outfile: target });
      } else {
        write(data, target);
      }
    } catch (e) {
      console.error(e)
      console.error("Failed to write configs for", target)
    }
  }
}



/**
 *
 * @returns
 */
async function main() {
  const os = require('os')
  const { homedir } = os.userInfo()
  const env_root = args.outdir || args.chroot;
  let src_dir = resolve(__dirname, '..')
  let data = {
    ...args,
    src_dir,
    server_bundle_dir: resolve(args.runtime_dir, 'server', 'main'),
    ui_bundle_dir: resolve(args.runtime_dir, 'ui', 'main'),
  }
  if (!/^\//.test(data.storage_dir)) {
    data.storage_dir = resolve(src_dir, data.storage_dir)
  }
  if (args.share_home) {
    data.share_home = `${homedir}:${homedir}:ro`
  }
  let base = 'configure/templates'
  let opt = [
    {
      template: resolve(base, 'docker.yaml.tpl'),
      outfile: resolve(src_dir, 'docker.yaml')
    },
    {
      template: resolve(base, 'setup.tpl'),
      outfile: resolve(src_dir, 'setup')
    },
    {
      template: resolve(base, 'drumee-rc/server-team/.dev-tools.rc/devel.sh'),
      outfile: resolve(src_dir, 'drumee-os/server-team/.dev-tools.rc/devel.sh')
    },
    {
      template: resolve(base, 'drumee-rc/server-team/.dev-tools.rc/deploy.sh'),
      outfile: resolve(src_dir, 'drumee-os/server-team/.dev-tools.rc/deploy.sh')
    },
    {
      template: resolve(base, 'drumee-rc/ui-team/.dev-tools.rc/devel.sh'),
      outfile: resolve(src_dir, 'drumee-os/ui-team/.dev-tools.rc/devel.sh')
    },
    {
      template: resolve(base, 'drumee-rc/ui-team/.dev-tools.rc/deploy.sh'),
      outfile: resolve(src_dir, 'drumee-os/ui-team/.dev-tools.rc/deploy.sh')
    }
  ]
  writeTemplates(data, opt)
}

main()
  .then(() => {
    exit(0);
  })
  .catch((e) => {
    console.error("Failed to setup Drumee infra", e);
    exit(0);
  });
