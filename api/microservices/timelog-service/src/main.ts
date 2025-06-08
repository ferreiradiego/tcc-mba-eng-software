import express from 'express';
import dotenv from 'dotenv';
import timelogRoutes from '@presentation/routes/timelogRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/timelogs', timelogRoutes);

app.get('/', (req, res) => res.send('TimeLog Service Running'));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`TimeLog service listening on port ${PORT}`);
});
