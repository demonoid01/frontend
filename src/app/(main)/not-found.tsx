import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-200">404 - Page Not Found</h1>
      <p className="mt-4 text-base text-gray-400">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link href="/">
        <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go to Homepage
        </button>
      </Link>
    </div>
  );
}
