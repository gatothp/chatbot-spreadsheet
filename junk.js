const player = require('node-wav-player');

player.play({
    path: 'files/notif.wav',
    sync: false // Set to true if you want it to block execution until finished
}).then(() => {
    console.log('WAV file is playing...');
}).catch((err) => {
    console.error('Error playing sound:', err);
});
