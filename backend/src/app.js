const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const routes = require('./routes');
const errorMiddleware = require('./middleware/error.middleware');
const etagMiddleware = require('./middleware/etag.middleware');
const logger = require('./utils/logger');
const { notFound } = require('./utils/httpErrors');

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(helmet());
app.use(
  morgan('dev', {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(etagMiddleware);

app.use('/api', routes);

app.use((req, res, next) => {
  next(notFound('Route not found'));
});

app.use(errorMiddleware);

module.exports = app;
