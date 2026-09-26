const { exec } = require('child_process');
console.log('Zipping... This may take a minute.');
exec('powershell -command "Compress-Archive -Path program\\CustomLobbies-win32-x64\\* -DestinationPath CustomLobbies-Desktop-App.zip -Force"', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Successfully zipped to CustomLobbies-Desktop-App.zip!');
});
