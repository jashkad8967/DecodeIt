const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists at:', envPath);
  console.log('If you need to update it, please edit it manually.');
  process.exit(0);
}

console.log('Creating .env file...');
console.log('Please enter your email credentials:');

// Read from command line arguments or use defaults
const emailUser = process.argv[2] || 'jkadakiabusiness@gmail.com';
const emailPass = process.argv[3] || 'Jk#1048967!';
const port = process.argv[4] || '3001';

const envContent = `EMAIL_USER=${emailUser}
EMAIL_PASS="${emailPass}"
PORT=${port}
`;

fs.writeFileSync(envPath, envContent, 'utf8');
console.log('✅ .env file created successfully at:', envPath);
console.log('\nFile contents:');
console.log(envContent);
console.log('⚠️  Please verify the EMAIL_PASS is correct (especially if it contains special characters like #)');
console.log('⚠️  Make sure you are using a Gmail App Password, not your regular password!');

