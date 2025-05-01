require('dotenv').config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const N8N_URL = "http://localhost:5678";
const N8N_TOKEN = process.env.N8N_TOKEN;

if (!N8N_TOKEN) {
  console.error('❌ N8N_TOKEN nu este definit în fișierul .env');
  process.exit(1);
}

const workflowsPath = path.join(__dirname, "workflows");
const files = fs.readdirSync(workflowsPath);

files.forEach((file) => {
  if (!file.endsWith(".json")) return;

  const workflow = JSON.parse(fs.readFileSync(path.join(workflowsPath, file), "utf-8"));
  
  // Remove the active property if it exists
  delete workflow.active;

  axios
    .post(`${N8N_URL}/api/v1/workflows`, workflow, {
      headers: { 
        "X-N8N-API-KEY": `${N8N_TOKEN}`
      },
    })
    .then((res) => {
      console.log(`✅ Workflow adăugat: ${file} (ID: ${res.data.id})`);
    })
    .catch((err) => {
      console.error(`❌ Eroare la ${file}:`, err.response?.data || err.message);
    });
});