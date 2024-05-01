const { exec } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (result.error) {
  console.error('Błąd podczas wczytywania zmiennych środowiskowych:', result.error);
  process.exit(1);
}

const host = process.env.HOST_DB;
const user = process.env.USER_DB;
const password = process.env.PASS_DB;
const database = process.env.NAME_DB;

const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString();

  return `${day}-${month}-${year}`;
}

const currentDate = getCurrentDate();
const backupFileName = `backup_${currentDate}.sql`;

const command = `mysqldump -h ${host} -u ${user} -p${password} ${database} > ${backupFileName}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Błąd podczas wykonywania backupu: ${stderr}`);
  } else {
    console.log(`Backup wykonany poprawnie. Zapisano do pliku: ${backupFileName}`);
  }
});
