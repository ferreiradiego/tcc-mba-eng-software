import express from 'express';
import dotenv from 'dotenv';
import ceremonyRoutes from '@presentation/routes/ceremonyRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/ceremonies', ceremonyRoutes);

app.get('/', (req, res) => res.send('Scrum Ceremony Service Running'));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Scrum Ceremony service listening on port ${PORT}`);
});
