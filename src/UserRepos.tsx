import React, { useEffect, useState } from 'react'
import Loading from './components/Loading';
import Search from './components/Search';
import data from "./mock_data.json";

const BASE_URL = "http://api.github.com/users/";
const TOKEN = "";

type Repo = {
  id: number;
  url: string;
}

function UserRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  console.log(repos)

  useEffect(() => {
    getUserRepos("fsiino");
  }, []);

  const getUserRepos = async (username: string) => {
    // TODO: temporarily mocking data below
    // const response = await fetch(BASE_URL + username + "/repos", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": "Bearer " + TOKEN,
    //   },
    // });
    // const result = await response.json();
    const fetchedData: Repo[] = await new Promise<Repo[]>((res) => {
      setTimeout(() => {
        res(data)
      }, 500)
    })

    setRepos(fetchedData);
    setLoading(false);
  };

  const mappedRepos = repos.map((repo, i) => {
    return (
      <ul>
        <li key={repo.id}>{repo.url}</li>
      </ul>
    )
  });

  const renderContent = () => {
    if (loading) {
      return <Loading />
    }
    return mappedRepos;
  };

  return (
    <>
      <div>Search Repos by Username</div>
      <div>{renderContent()}</div>
    </>
  );
}

export default UserRepos;