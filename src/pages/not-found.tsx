export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary">৪০৪</h1>
      <p className="mt-4 text-xl text-muted-foreground">পৃষ্ঠাটি পাওয়া যায়নি।</p>
      <a href="/" className="mt-8 px-6 py-3 bg-primary text-white rounded-xl font-semibold">
        হোমে ফিরুন
      </a>
    </div>
  );
}
