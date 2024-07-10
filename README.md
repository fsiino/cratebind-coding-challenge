# Cratebind / NexusFlow Frontend Assessment

## Description
Uses the Github REST API to search for and return a list of repositories by username.

## Instructions

- cd into the root directory

- run the following:

  ```bash
  $ npm install
  $ npm start
  ```

- navigate to `http://localhost:3000`.


## Things to note

This uses the [Github REST API]("https://docs.github.com/en/rest?apiVersion=2022-11-28). There is no token by default, so we are limited to the 60 per hour rate limit for unauthenticated requests.

Each cycle through the pagination takes a separate API call, so it's easy to hit the limit by clicking through them too fast.

To avoid getting rate limited, modify `UserRepos.tsx` to include a Bearer token in the Authorization header:

```javascript
const BASE_URL = "https://api.github.com/users/";
const TOKEN = "your_token_here";        // <-- here
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + TOKEN,    // <-- and here
};
```

Authenticated requests are capped at 5000 per hour.
