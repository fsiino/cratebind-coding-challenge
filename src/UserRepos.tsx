import { useEffect, useRef, useState } from 'react'
import './UserRepos.css';

const BASE_URL = "https://api.github.com/users/";
const HEADERS = {
  "Content-Type": "application/json"
}

type Repo = {
  id: number;
  html_url: string;
  stargazers_count: number;
  name: string;
  language: string;
  description: string;
  fork: boolean;
};

const LOGO = <img alt="github logo" src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" className="logo" />

function UserRepos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearLastResult = (): void => {
    setRepos([]);
    setError(null);
  };

  const getUserRepos = async (username: string) => {
    setLoading(true);
    clearLastResult();
    try {
      const response = await fetch(BASE_URL + username + "/repos", {
        headers: HEADERS,
      });
      const result = await response.json();
      if (response.ok) {
        const sorted = sortAndFilter(result);
        setRepos(sorted);
      } else {
        setError("Error: " + result.status + " " + result.message);
      }
    } catch (error) {
      setError("Network error: " + error);
    }
    setLoading(false);
  };

  const sortAndFilter = (repos: Repo[]): Repo[] => {
    return repos
      .filter((repo: Repo) => !repo.fork)
      .sort((a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count);
  };

  const getTotalStars = (repos: Repo[]): number => {
    return repos.reduce((acc, cur) => acc + cur.stargazers_count, 0)
  };

  const displayStars = (starCount: number) => {
    let stars = "";
    let counter = starCount <= 5 ? starCount : 5;
    while (counter > 0) {
      stars += "⭐";
      counter--;
    }
    return stars;
  };

  const repoList: JSX.Element = (
    <>
      {Boolean(repos.length) && (
        <div className="message">
          Found <b>{repos.length}</b> repositories totaling{" "}
          <b>{getTotalStars(repos)}</b> stars. (This does not include forks)
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Language</th>
            <th>Stars</th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo, i) => {
            return (
              <tr key={repo.id}>
                <td>{i + 1}</td>
                <td>
                  <div>{displayStars(repo.stargazers_count)}</div>
                  <a href={repo.html_url} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                </td>
                <td className="description">{repo.description}</td>
                <td>{repo.language}</td>
                <td>
                  <div>
                    {repo.stargazers_count > 0
                      ? repo.stargazers_count
                      : "None yet!"}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );

const handleOnSubmit = (): void => {
  getUserRepos(text);
};

  const searchFields: JSX.Element = (
    <div>
      <form onSubmit={handleOnSubmit}>
        <input
          type="text"
          placeholder="Enter github username here"
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={inputRef}
        />
        <button disabled={!Boolean(text)} type="submit">Search</button>
      </form>
    </div>
  );

  const renderContent = (): string | JSX.Element => {
    if (loading) {
      return "Loading...";
    }
    return (
      <>
        {searchFields}
        {error}
        {Boolean(repos.length) && repoList}
      </>
    );
  };

  return (
    <>
      <div>{LOGO}</div>
      <div className="header">Github Repository Lookup</div>
      <div>{renderContent()}</div>
    </>
  );
};

export default UserRepos;