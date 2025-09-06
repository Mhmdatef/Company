const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');


if (!process.env.DATABASE || !process.env.DATABASE_PASSWORD) {
  console.error('❌ DATABASE or DATABASE_PASSWORD is missing in config.env');
  process.exit(1); }

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  })
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => {
    console.error(`❌ Database connection failed: ${err.message}`);
    process.exit(1);
  });

const port = process.env.PORT ;
app.listen(port, () => {  
  console.log(`🚀 App running on port ${port}...`);
});

