import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border p-8">
        <h1 className="mb-6 text-center text-2xl font-bold">Welcome Back</h1>

        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text_dim">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text_dim">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded border p-2"
              required
            />
            <p className="mt-1 text-right text-sm">
              <Link href="#" className="text-accent hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-orange-600">
            Sign In
          </Button>
        </form>

        <div className="my-6 text-center text-sm text-text_dim">or</div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-center">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1