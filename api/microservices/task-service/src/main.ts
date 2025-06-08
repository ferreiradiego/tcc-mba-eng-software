import express from 'express';
import dotenv from 'dotenv';
import taskRoutes from '@presentation/routes/taskRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/tasks', taskRoutes);

app.get('/', (req, res) => res.send('Task Service Running'));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Task service listening on port ${PORT}`);
});
