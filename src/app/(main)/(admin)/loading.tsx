// app/loading.js
export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[999] text-black">
      <div className="loader">Loading...</div>
    </div>
  );
}
