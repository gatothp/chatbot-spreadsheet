// try to run under nodejs but fails of async function
const readline = require("readline");
const { exec } = require("child_process");
const { ss } = require("chatbot/ss");
const fs = require("fs");
const config = require("../config/config.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function pertanyaan(kalimat) {
  return new Promise((resolve, reject) => {
    rl.question(kalimat, (text) => {
      resolve(text);
    });
  });
}
const glonoWA = JSON.parse(global.nomerWA);
const nomors = glonoWA.map(value => value.toString());
let pesan = global.pesanWA;
pesan = pesan.replace(/\\n/g, '\n'); // utk akses dari notif.js
const commands = {
  "kirim pesan": async (conn) => {
    let nomor = nomors[0];
    [nomor] = await conn.onWhatsApp(nomor);
    if (nomor?.exists) {
      await conn.sendMessage(nomor.jid, { text: pesan });
      console.log("... sent to " + nomor.jid.split("@")[0]);
    } else {
      console.log(`... no tidak terdaftar di daftar WA`);
    }
<<<<<<< HEAD
    process.exit();
    //    termBot(conn);
=======
    termBot(conn);
  },
  "scrap dari spreadsheet": async (conn) => {
    if (!config.useSpreadsheet) {
      console.log("spreadsheet tidak aktif");
      termBot(conn);
      return;
    }
    let numbers = await ss.getRows("scrap!A2:B");
    let b = 2;
    for (let i of numbers) {
      if (!i[1]) {
        let [no] = await conn.onWhatsApp(i[0]);
        if (no?.exists) {
          console.log(i[0] + " terdaftar di WA");
          ss.addData("scrap!B" + b, ["terdaftar di WA"]);
        } else {
          console.log(i[0] + " tidak terdaftar di WA");
          ss.addData("scrap!B" + b, ["tidak terdaftar di WA"]);
        }
      } else {
        console.log(i[0] + " " + i[1]);
      }
      b += 1;
    }
    termBot(conn);
>>>>>>> 007ae0fb88d02f6c938f5c233240a4cb86cf7273
  },
  "blast message": async (conn) => {
    for (const el of nomors) {
      if (el) {
        await conn.sendMessage(el + "@s.whatsapp.net", { text: pesan });
        console.log("... sent to " + el);
      }
    }
<<<<<<< HEAD
    process.exit();
=======
    let simpan = await pertanyaan("y/n (default n) simpan pesan? : ");
    if (simpan == "y") {
      fs.writeFileSync("config/blast.json", JSON.stringify(blast));
    }
    blast = JSON.parse(fs.readFileSync("config/blast.json"));
    termBot(conn);
  },
  "blast dari spreadsheet": async (conn) => {
    if (!config.useSpreadsheet) {
      console.log("spreadsheet tidak aktif");
      termBot(conn);
      return;
    }
    let data = await ss.getRows("scrap!a2:d");
    let r = 2;
    console.log("sedang mengirim pesan .......");
    for (let d of data) {
      if (!d[3]) {
        let [n] = await conn.onWhatsApp(d[0]);
        if (n?.exists) {
          await conn.sendMessage(n.jid, { text: d[2] });
          ss.addData("scrap!d" + r, ["pesan terkirim"]);
        } else {
          ss.addData("scrap!d" + r, ["pesan tidak terkirim, nomor salah"]);
        }
      } else {
        console.log(d[3]);
      }
      r += 1;
    }
    console.log("mengirim pesan selesai ......");
    termBot(conn);
>>>>>>> 007ae0fb88d02f6c938f5c233240a4cb86cf7273
  },
  menu: async (conn) => {
    let i = 0;
    console.log("... command yang tersedia");
    for (const c in commands) {
      console.log(i + ". " + c);
      i++;
    }
    termBot(conn);
  },
  exit: () => {
    process.exit();
  },
};

/* console.log(
  "WHATSAPP BOT SPREADSHEET - by NGAJI NGODING"
);
 */
async function termBot(conn) {
  if (nomors.length > 1) {
      cmd = 1;  // blast
    } else {
      cmd = 0;  // single
    }
  let keys = Object.keys(commands);
  if (commands[keys[cmd]] || commands[cmd]) {
    if (commands[cmd]) {
      commands[cmd](conn);
    } else {
      commands[keys[cmd]](conn);
    }
  } else {
    console.log("commands " + cmd + " tidak ditemukan");
    commands["menu"](conn);
  }
}

module.exports = { termBot };
