import express, { Request, Response, NextFunction } from 'express';
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes';
import userRoutes from "./routes/userRoutes";
import "./config/passport"
import { extractTokenFromCookie } from './middlewares/token';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())

app.use(extractTokenFromCookie);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('API is running');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
