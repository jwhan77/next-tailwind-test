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
      <div className="h-4/5 flex">
        <img
          className="w-3/4 h-3/4 sm:w-1/2 sm:h-1/2 block m-auto"
          src="/developer_activity.svg"
          alt="activity"
        />
      </div>
    </>
  );
}
