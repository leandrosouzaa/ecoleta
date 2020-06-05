import path from 'path';
import express from 'express';
import { errors } from 'celebrate';
import cors from 'cors';

import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(3333, () => {
    console.log('👷 Server Started on port 3333!');
});

