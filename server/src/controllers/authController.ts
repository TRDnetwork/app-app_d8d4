import { Request, Response } from 'express';
import User from '../models/User';
import { generateTokens } from '../utils/token';
import { sendEmail } from '../services/emailService';
import { v4 as uuidv4 } from 'uuid';
import { registerSchema, loginSchema } from '../utils/validation';
import bcrypt from 'bcrypt';
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  BASE_URL: str(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      ...validated,
      password_hash: hashedPassword,
      email_verification_token: verificationToken,
      email_verification_expires: verificationExpires,
    });

    await sendEmail(
      user.email,
      'Verify your email address',
      'verify-email',
      {
        name: user.name,
        verifyUrl: `${env.BASE_URL}/verify-email?token=${verificationToken}`,
      }
    );

    const { password_hash, ...userWithoutPassword } = user.toObject();

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    if (error.issues) {
      return res.status(400).json({ error: 'Validation failed', details: error.issues });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validated.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(validated.password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.email_verified) {
      return res.status(401).json({
        error: 'Please verify your email before logging in',
      });