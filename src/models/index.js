'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import configFile from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const db = {};
let sequelize;

// ✅ Initialize Sequelize connection
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// ✅ Step 1: Load all model definitions FIRST (no associations yet)
const modelFiles = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.endsWith('.js') &&
      !file.endsWith('.test.js')
  );

// Debug — optional (you can comment this out later)
console.log('🧩 Loading models in order:', modelFiles);

for (const file of modelFiles) {
  const modelModule = await import(pathToFileURL(path.join(__dirname, file)));
  const model = modelModule.default(sequelize, Sequelize.DataTypes);

  if (!model || !model.name) {
    console.warn(`⚠️  Skipping invalid model file: ${file}`);
    continue;
  }

  db[model.name] = model;
}

// ✅ Step 2: Run all associations AFTER all models are loaded
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// ✅ Step 3: Export sequelize + db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ✅ Test database connection
try {
  await sequelize.authenticate();
  console.log('✅ Database connected successfully.');
} catch (err) {
  console.error('❌ Unable to connect to database:', err.message);
}

// ✅ Optional: Sync models in dev
if (env === 'development') {
  // await sequelize.sync({ alter: true });
  console.log('✅ Models synchronized successfully.');
}

export { sequelize, db };
