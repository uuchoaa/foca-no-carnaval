export function Divider() {
  return (
    <div className="relative h-8 flex items-center justify-center my-6">
      <div className="absolute inset-0 flex items-center justify-center gap-1">
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        <div className="w-1 h-1 rounded-full bg-gray-300 opacity-80" />
        <div className="w-1 h-1 rounded-full bg-gray-300 opacity-60" />
        <div className="w-1 h-1 rounded-full bg-gray-300 opacity-40" />
        <div className="w-1 h-1 rounded-full bg-gray-300 opacity-20" />
        <div className="w-32 h-px bg-gray-200" />
        <div className="w-1 h-1 rounded-full bg-gray-300 opacity-20" />
        <div className="w-1 h-1 rounded-full bg-gray-300 opacity-40" />
        <div className="w-1 h-1 rounded-full bg-gray-300 opacity-60" />
        <div className="w-1 h-1 rounded-full bg-gray-300 opacity-80" />
        <div className="w-1 h-1 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}
