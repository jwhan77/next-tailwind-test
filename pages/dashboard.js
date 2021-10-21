import { useSession } from "next-auth/client";

export default function Dashboard() {
  const [session] = useSession();

  if (session) {
    return (
      <>
        <button>Dashboard page</button>
      </>
    );
  }
  return (
    <>
      <div>Please sign in</div>
    </>
  );
}
