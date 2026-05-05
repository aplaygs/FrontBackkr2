import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACCESS_SECRET = 'your-access-secret-key-123';
const REFRESH_SECRET = 'your-refresh-secret-key-456';
const ACCESS_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_EXPIRES_IN = '7d'; // 7 days

enum Role {
  USER = 'user',
  SELLER = 'seller',
  ADMIN = 'admin'
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  passwordHash: string;
  role: Role;
}

interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
}

// In-memory databases
let users: User[] = [
  {
    id: 'admin_id',
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'Super',
    passwordHash: '$2b$10$YnByR7GzVpD6KjI0yvE6Ou5tU/u8k5I8pZ.wP9E9S2.VvjP6A6qW6', // password: admin
    role: Role.ADMIN
  }
];
let products: Product[] = [
  { id: '1', title: 'Smartphone X', category: 'Electronics', description: 'Powerful flagship.', price: 999 },
  { id: '2', title: 'Laptop Pro', category: 'Computers', description: 'Best for work.', price: 1499 }
];
let refreshTokens = new Set<string>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- Middlewares ---

  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, ACCESS_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }
  };

  const roleMiddleware = (allowedRoles: Role[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
      next();
    };
  };

  // --- Auth Routes ---

  app.post('/api/auth/register', async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: nanoid(),
      email,
      first_name,
      last_name,
      passwordHash,
      role: Role.USER // Default role
    };

    users.push(newUser);
    res.status(201).json({ id: newUser.id, email: newUser.email });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES_IN }
    );

    refreshTokens.add(refreshToken);

    res.json({ accessToken, refreshToken });
  });

  app.post('/api/auth/refresh', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken || !refreshTokens.has(refreshToken)) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    try {
      const payload: any = jwt.verify(refreshToken, REFRESH_SECRET);
      const user = users.find(u => u.id === payload.sub);
      if (!user) return res.status(401).json({ error: 'User not found' });

      // Rotation
      refreshTokens.delete(refreshToken);

      const newAccessToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
      );

      const newRefreshToken = jwt.sign(
        { sub: user.id },
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES_IN }
      );

      refreshTokens.add(newRefreshToken);

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  });

  app.get('/api/auth/me', authMiddleware, (req: any, res) => {
    const user = users.find(u => u.id === req.user.sub);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;
    res.json(safeUser);
  });

  // --- User Management (Admin only) ---

  app.get('/api/users', authMiddleware, roleMiddleware([Role.ADMIN]), (req, res) => {
    res.json(users.map(({ passwordHash, ...u }) => u));
  });

  app.get('/api/users/:id', authMiddleware, roleMiddleware([Role.ADMIN]), (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { passwordHash, ...u } = user;
    res.json(u);
  });

  app.put('/api/users/:id', authMiddleware, roleMiddleware([Role.ADMIN]), (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

    const { first_name, last_name, role } = req.body;
    users[userIndex] = { ...users[userIndex], first_name, last_name, role };
    res.json(users[userIndex]);
  });

  app.delete('/api/users/:id', authMiddleware, roleMiddleware([Role.ADMIN]), (req, res) => {
    users = users.filter(u => u.id !== req.params.id);
    res.json({ success: true });
  });

  // --- Products Routes ---

  app.get('/api/products', (req, res) => {
    // Open for all (Guest too) or limited to Users? Assignment says "User - only viewing"
    // Usually catalog is public but for simplicity we keep it open.
    res.json(products);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', authMiddleware, roleMiddleware([Role.SELLER, Role.ADMIN]), (req, res) => {
    const { title, category, description, price } = req.body;
    const newProduct: Product = { id: nanoid(), title, category, description, price: Number(price) };
    products.push(newProduct);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', authMiddleware, roleMiddleware([Role.SELLER, Role.ADMIN]), (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });

    const { title, category, description, price } = req.body;
    products[index] = { ...products[index], title, category, description, price: Number(price) };
    res.json(products[index]);
  });

  app.delete('/api/products/:id', authMiddleware, roleMiddleware([Role.ADMIN]), (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // --- Vite Dev Server Setup ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
