require('dotenv').config();
const express = require('express');
const { prismaError, serverError, notFound, clientError } = require('./middlewares/errorHandling');
const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

app.use('/api/v1', require('./routes'));
app.get('/api/health', (req, res) => res.send('OK'));

app.use(prismaError);
app.use(clientError);
app.use(serverError);
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
