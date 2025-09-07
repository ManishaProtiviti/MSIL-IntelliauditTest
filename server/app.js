// app.js
import express from 'express';
import claimRoutes from './api/claim/claim.route.js'
import authRoutes from './api/auth/auth.route.js'
import enterpriseRoutes from './api/enterprise/enterprise.routes.js';
import errorHandler from './middlewares/errorHandler.js';
import cors from 'cors';
import path from 'path';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/claim', claimRoutes);
app.use('/api/auth', authRoutes);
app.use('/enterprise', enterpriseRoutes);
console.log(path.join(process.cwd() , "uploads"))
app.use('/uploads', express.static(path.join(process.cwd() , "uploads")))
app.use(errorHandler); // Catch-all error handler

export default app;
