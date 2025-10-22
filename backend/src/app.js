const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');
const healthRoutes = require('./routes/health.route');
const groupRoutes = require('./routes/groups.route');
const goalRoutes = require('./routes/goals.route');
const stakingRoutes = require('./routes/staking.route');
// Removed deleted routes: contributions, admin, test, achievements, analytics
const { env } = require('./config/env');
const notificationRoutes = require('./routes/notifications.route');
// Removed deleted routes: transactions, enhancedCommunity, community, emailVerification

const app = express();

// Create HTTP server for WebSocket
const server = require('http').createServer(app);

// Initialize WebSocket
try {
  const NotificationSocket = require('./websocket/notificationSocket');
  const notificationSocket = new NotificationSocket(server);
  global.notificationSocket = notificationSocket;
  console.log('✅ WebSocket server initialized on /ws path');
} catch (error) {
  console.log('⚠️ WebSocket not available - notifications will work without real-time updates');
  console.error('WebSocket error:', error);
  global.notificationSocket = null;
}

// Security & basics
app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Session configuration for OAuth
app.use(session({
  secret: env.jwtSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport removed - using Web3 wallet authentication

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Routes
app.use('/api/health', healthRoutes);
// Web2 auth routes removed - using Web3 wallet authentication
app.use('/api/groups', groupRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/staking', stakingRoutes);
// Removed deleted route registrations
app.use('/api/notifications', notificationRoutes);
// Removed deleted route registrations

// Dashboard routes
app.use('/api/dashboard', require('./routes/dashboard.route'));

// AI routes
app.use('/api/ai', require('./routes/ai.route'));

// Swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 & Error handler
app.use(notFound);
app.use(errorHandler);

// Export both app and server
module.exports = { app, server };