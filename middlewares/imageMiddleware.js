const express=require('express')
const bodyParser=require('body-parser')
const cors=require('cors')

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' })); // Limit Base64 payload to 2MB