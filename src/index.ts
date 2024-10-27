import express from 'express';
import cors from 'cors';
import carRoutes from './routes/carRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', carRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});