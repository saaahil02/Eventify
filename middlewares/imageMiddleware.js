import cors from 'cors';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' })); // Limit Base64 payload to 2MB