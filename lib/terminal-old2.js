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

let blast = JSON.parse(fs.readFileSync("config/blast.json"));
const commands = {
  "kirim pesan": async (conn) => {
    let nomor = await pertanyaan("Nomor tujuan: ");
    [nomor] = await conn.onWhatsApp(nomor);
    if (nomor?.exists) {
      let pesan = await pertanyaan("Pesan: ");
      await conn.sendMessage(nomor.jid, { text: pesan });
      console.log("... pesan telah terkirim ke " + nomor.jid.split("@")[0]);
    } else {
      console.log(`... no tidak terdaftar di daftar WA`);
    }
    termBot(conn);
  },
  "blast message": async (conn) => {
    if (!blast["no tujuan"].length) {
      console.log("no tujuan kosong, jalankan command cek nomor dulu");
      termBot(conn);
      return;
    }
    if (blast.pesan == "") {
      let message = await pertanyaan("masukkan pesan : ");
      blast.pesan = message;
    }
    for (const el of blast["no tujuan"]) {
      console.log(el);
      if (el) {
        await conn.sendMessage(el + "@s.whatsapp.net", { text: blast.pesan });
      }
    }
    let simpan = await pertanyaan("y/n (default n) simpan pesan? : ");
    if (simpan == "y") {
      fs.writeFileSync("config/blast.json", JSON.stringify(blast));
    }
    blast = JSON.parse(fs.readFileSync("config/blast.json"));
    termBot(conn);
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

console.log(
  "WHATSAPP BOT SPREADSHEET\nyang dikembangkan oleh NGAJI NGODING"
);

async function termBot(conn) {
  const cmd = await pertanyaan("Command: ");
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
