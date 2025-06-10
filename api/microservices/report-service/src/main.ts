import express from 'express';
import dotenv from 'dotenv';
import reportRoutes from './presentation/routes/reportRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/reports', reportRoutes);

app.get('/', (req, res) => res.send('Report Service Running'));

const PORT = process.env.PORT || 4003;

app.listen(PORT, () => {
  console.log(`Report service listening on port ${PORT}`);
});
