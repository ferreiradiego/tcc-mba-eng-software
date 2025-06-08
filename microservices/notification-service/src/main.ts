import express from 'express';
import dotenv from 'dotenv';
import notificationRoutes from './presentation/routes/notificationRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/notifications', notificationRoutes);

app.get('/', (req, res) => res.send('Notification Service Running'));

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Notification service listening on port ${PORT}`);
});
