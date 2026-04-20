# ShopSphere Deployment Guide

## Deploy to Vercel

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account.
3. Click "New Project" and import your repository.
4. Configure the project settings:
   - Framework Preset: `Vite`
   - Root Directory: `/` (project root)
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`
5. Add environment variables in the Vercel dashboard under Settings > Environment Variables:
   - `VITE_API_URL` - Your backend API URL (e.g., `https://shopsphere-server.onrender.com`)
   - `VITE_CLIENT_URL` - Your frontend URL (e.g., `https://shopsphere.vercel.app`)
   - `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
6. Click "Deploy" to deploy your frontend.

## Environment Variables

### Frontend (Vercel)
| Key | Value |
| --- | --- |
| `VITE_API_URL` | Base URL for the Express backend (e.g., `https://shopsphere-server.onrender.com`) |
| `VITE_CLIENT_URL` | Base URL for the frontend (e.g., `https://shopsphere.vercel.app`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for client-side payments |

### Backend (Railway/Render)
| Key | Value |
| --- | --- |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens |
| `MONGODB_URI` | MongoDB connection string (e.g., `mongodb+srv://...`) |
| `STRIPE_SECRET_KEY` | Stripe secret key for server-side operations |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `RESEND_API_KEY` | API key for sending transactional emails |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FACEBOOK_APP_ID` | Facebook OAuth app ID |
| `FACEBOOK_APP_SECRET` | Facebook OAuth app secret |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 |
| `S3_BUCKET_NAME` | AWS S3 bucket name for product images |
| `REDIS_HOST` | Redis host for job queues (e.g., `localhost`) |
| `REDIS_PORT` | Redis port (e.g., `6379`) |
| `REDIS_PASSWORD` | Redis password (if required) |
| `REDIS_TLS` | Whether to use TLS for Redis connection (`true` or `false`) |
| `UPLOAD_DIR` | Directory for temporary file uploads (e.g., `/tmp/shopsphere-imports`) |
| `NODE_ENV` | Environment mode (`development` or `production`) |
| `PORT` | Port for the Express server (e.g., `3001`) |
| `SERVER_URL` | Base URL for the server (e.g., `https://shopsphere-server.onrender.com`) |
| `CLIENT_URL` | Base URL for the frontend (e.g., `https://shopsphere.vercel.app`) |
| `LOG_LEVEL` | Logging level (`debug`, `info`, `warn`, `error`) |

## First-time setup

1. Deploy the backend to Railway or Render:
   - Push your server code to a separate GitHub repository.
   - Create a new service on Railway/Render and import your repository.
   - Configure environment variables as listed above.
   - Deploy the service.

2. Set up MongoDB:
   - Create a MongoDB Atlas cluster or use a local instance.
   - Update the `MONGODB_URI` environment variable with your connection string.

3. Set up Stripe:
   - Create a Stripe account and get your API keys.
   - Add your frontend URL as a redirect URI in the Stripe dashboard.
   - Set up webhook endpoints:
     - Endpoint URL: `https://shopsphere-server.onrender.com/api/stripe/webhook`
     - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

4. Set up Resend:
   - Create a Resend account and get your API key.
   - Update the `RESEND_API_KEY` environment variable.

5. Set up AWS S3:
   - Create an S3 bucket for product images.
   - Create an IAM user with S3 permissions and get access keys.
   - Update the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `S3_BUCKET_NAME` environment variables.

6. Set up OAuth (Google/Facebook):
   - Create OAuth apps on Google and Facebook developer platforms.
   - Add your callback URLs:
     - Google: `https://shopsphere-server.onrender.com/api/auth/oauth/google/callback`
     - Facebook: `https://shopsphere-server.onrender.com/api/auth/oauth/facebook/callback`
   - Update the `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, and `FACEBOOK_APP_SECRET` environment variables.

7. Run database migrations and seed data:
   - Run `npm run migrate` to apply database migrations.
   - Run `npm run seed` to populate the database with initial data.

8. Test the application:
   - Open your deployed frontend URL.
   - Register a new user and log in.
   - Add products to cart and complete a test order.
   - Verify that order confirmation emails are sent.
   - Check that Stripe payments are processed correctly.
   - Verify that order status updates are reflected in the order history.

9. Monitor and maintain:
   - Set up logging and error tracking (e.g., Sentry).
   - Monitor server performance and database usage.
   - Regularly update dependencies and apply security patches.
   - Back up your database regularly.