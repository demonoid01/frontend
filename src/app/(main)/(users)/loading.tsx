// app/loading.js
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[999] text-white">
      <div className="w-8 h-8 rounded-full border-2 border-b-transparent animate-spin"></div>
    </div>
  );
}
