import configRoutes from './routes/index.js';
import cors from 'cors';
import express from 'express';
const app = express();


app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

configRoutes(app);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});
