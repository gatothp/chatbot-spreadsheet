const readline = require("readline");
const { exec } = require("child_process");
const { ss } = require("chatbot/ss");
const fs = require("fs");
const config = require("../config/config.json");

console.log(
  "... masuk terminal\nyang dikembangkan oleh NGAJI NGODING"
);
nomor = "6281317215503";
pesan = "... dari terminal";
await conn.sendMessage(nomor.jid, { text: pesan });
console.log("... pesan telah terkirim ke " + nomor.jid.split("@")[0]);


/* const commands = {
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
}; */
