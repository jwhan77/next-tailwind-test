import { useSession } from "next-auth/client";
import Link from "next/link";

export default function Home() {
  const [session] = useSession();

  if (session) {
    return (
      <>
        <Link href="/dashboard">
          <a>Open Dashboard</a>
        </Link>
      </>
    );
  }
  return (
    <>
      <div>Please sign in</div>
    </>
  );
}
