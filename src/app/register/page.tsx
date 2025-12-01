import Link from "next/link";

export const metadata = {
  title: "Create account | site-ai-chatbot",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-50">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl shadow-black/40">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Get a dashboard, API token, and embeddable AI chat in minutes.
          </p>
        </div>
        <form action="/api/auth/register" method="post" className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-zinc-200">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none ring-0 transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none ring-0 transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-zinc-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none ring-0 transition focus:border-zinc-400 focus:ring-1 focus:ring-zinc-500"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-zinc-50 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
          >
            Create account
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-100 underline-offset-2 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
