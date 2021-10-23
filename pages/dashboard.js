import { useSession } from "next-auth/client";
import React, { useState } from "react";
import Modal from "react-modal";
import Grid from "../components/Grid";

const Dashboard = () => {
  const [session] = useSession();

  const [repos, setRepos] = useState([]);
  const [myRepos, setMyRepos] = useState([]);

  const [loadReposModalIsOpen, setLoadReposModalIsOpen] = useState(false);
  const [checkedRepos, setCheckedRepos] = useState([]);

  const closeLoadReposModal = () => {
    setCheckedRepos([]);
    setLoadReposModalIsOpen(false);
  };

  const openLoadReposModal = () => {
    const fetchRepos = async () => {
      const response = await fetch("/api/repos");
      const data = await response.json();
      setRepos(data);
      console.log(data);
    };

    fetchRepos();

    setLoadReposModalIsOpen(true);
  };

  const handleCheckRepoChange = (e) => {
    if (e.target.checked) {
      let newCheckedRepos = [...checkedRepos];
      newCheckedRepos.push(e.target.value);
      setCheckedRepos(newCheckedRepos);
    } else {
      let newCheckedRepos = [...checkedRepos];
      let filteredCheckedRepos = newCheckedRepos.filter(
        (id) => id !== e.target.value
      );
      setCheckedRepos(filteredCheckedRepos);
    }
  };

  const handleLoadReposSubmit = (e) => {
    e.preventDefault();

    let newCheckedReposObj = repos.filter((repo) =>
      checkedRepos.includes(repo.id.toString())
    );
    console.log(newCheckedReposObj);
    let newMyRepos = [...myRepos, ...newCheckedReposObj];
    console.log(newMyRepos);

    setMyRepos(newMyRepos);
    setTimeout(() => {
      closeLoadReposModal();
    }, 500);
  };

  if (session) {
    return (
      <div className="w-10/12 m-auto flex flex-row">
        <div className="w-4/12">
          <div>
            <p>My repos</p>
            <ul>
              {myRepos.map((repo) => {
                return <li key={repo.id}>{repo.name}</li>;
              })}
            </ul>
          </div>

          <div>
            <button onClick={openLoadReposModal}>Load repos</button>
            <Modal
              isOpen={loadReposModalIsOpen}
              onRequestClose={closeLoadReposModal}
              contentLabel="Load Repos"
              ariaHideApp={false}
            >
              <h2>Repos in GitHub</h2>
              <button onClick={closeLoadReposModal}>close</button>
              <form onSubmit={handleLoadReposSubmit}>
                {repos.map((repo) => {
                  return (
                    <div key={repo.id}>
                      <label>
                        <input
                          name={repo.name}
                          value={repo.id}
                          type="checkbox"
                          onChange={handleCheckRepoChange}
                        ></input>
                        {repo.name}
                      </label>
                    </div>
                  );
                })}
                <input type="submit" value="Submit" />
              </form>
            </Modal>
          </div>
        </div>
        <div>
          <Grid />
        </div>
      </div>
    );
  }
  return (
    <>
      <div>Please sign in</div>
    </>
  );
};

export default Dashboard;
