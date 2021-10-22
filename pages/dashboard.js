import { useSession } from "next-auth/client";
import { useState } from "react";

import Grid from "../components/Grid";

export default function Dashboard() {
  const [session] = useSession();

  const [repos, setRepos] = useState([]);

  const fetchRepos = async () => {
    const response = await fetch("/api/repos");
    const data = await response.json();
    setRepos(data);
  };

  if (session) {
    return (
      <>
        <button onClick={fetchRepos}>Load repos</button>
        {repos.map((repo) => {
          return (
            <div key={repo.id}>
              {repo.id}: {repo.name}
            </div>
          );
        })}

        <Grid />
      </>
    );
  }
  return (
    <>
      <div>Please sign in</div>
    </>
  );
}
