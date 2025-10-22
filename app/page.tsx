import { Waitlist } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">play to feel</h1>
      <Waitlist />
    </div>
  );
}
