const fs = require('fs');
const path = require('path');

// Define the path to the 'sessions' folder
const sessionsFolderPath = path.join(__dirname, 'sessions');

// Check if the folder exists
if (!fs.existsSync(sessionsFolderPath)) {
    console.error(`The folder '${sessionsFolderPath}' does not exist.`);
    process.exit(1);
}

// Read all files in the folder
fs.readdir(sessionsFolderPath, (err, files) => {
    if (err) {
        console.error(`Error reading the folder: ${err.message}`);
        return;
    }

    // Loop through each file and delete it
    files.forEach(file => {
        const filePath = path.join(sessionsFolderPath, file);

        // Check if it's a file (not a subdirectory)
        fs.stat(filePath, (err, stats) => {
            if (err) {
                console.error(`Error checking file stats: ${err.message}`);
                return;
            }

            if (stats.isFile()) {
                fs.unlink(filePath, err => {
                    if (err) {
                        console.error(`Error deleting file ${filePath}: ${err.message}`);
                    } else {
                        console.log(`Deleted file: ${filePath}`);
                    }
                });
            }
        });
    });
});