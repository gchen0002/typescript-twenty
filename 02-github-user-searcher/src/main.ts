import './style.css';

interface UserData {
  avatar_url: string;
  name: string;
  login: string; // The @username
  created_at: string;
  bio: string | null; // Can be null
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  company: string | null;
  html_url: string;
}

const searchInput = document.getElementById("user-input") as HTMLInputElement;
const searchBtn = document.getElementById("search-btn") as HTMLButtonElement;
const avatar = document.getElementById("avatar") as HTMLImageElement;
const nameElement = document.getElementById("name") as HTMLElement;
const usernameElement = document.getElementById("username") as HTMLAnchorElement;
const dateElement = document.getElementById("date") as HTMLElement;
const bioElement = document.getElementById("bio") as HTMLElement;
const reposElement = document.getElementById("repos") as HTMLElement;
const followersElement = document.getElementById("followers") as HTMLElement;
const followingElement = document.getElementById("following") as HTMLElement;
const locationElement = document.getElementById("location") as HTMLElement;
const blogElement = document.getElementById("blog") as HTMLAnchorElement;
const twitterElement = document.getElementById("twitter") as HTMLElement;
const companyElement = document.getElementById("company") as HTMLElement;
const errorElement = document.getElementById("no-results") as HTMLElement;

async function fetchUser(username: string): Promise<UserData | null> {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

function updateUI(user: UserData) {
  avatar.src = user.avatar_url;
  nameElement.innerText = user.name || user.login;
  usernameElement.innerText = `@${user.login}`;
  usernameElement.href = user.html_url;
  dateElement.innerText = new Date(user.created_at).toLocaleDateString();
  bioElement.innerText = user.bio || "No bio provided";
  reposElement.innerText = user.public_repos.toString();
  followersElement.innerText = user.followers.toString();
  followingElement.innerText = user.following.toString();
  locationElement.innerText = user.location || "Not available";
  if (user.blog) {
    blogElement.href = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
    blogElement.innerText = user.blog;
  } else {
    blogElement.removeAttribute('href');
    blogElement.innerText = 'Not available';
  }
  twitterElement.innerText = user.twitter_username || "Not available";
  companyElement.innerText = user.company || "Not available";
}

function handleSearch() {
  searchBtn.disabled = true;
  searchBtn.innerText = "Loading...";
  const username = searchInput.value.trim();
  if (username) {
    fetchUser(username).then((user) => {
      if (user) {
        updateUI(user);
        errorElement.classList.add("hidden");
      } else {
        errorElement.classList.remove("hidden");
      }
    })
      .catch((error) => {
        console.error("Error fetching user:", error);
        errorElement.classList.remove("hidden");
      })
      .finally(() => {
        searchBtn.disabled = false;
        searchBtn.innerText = "Search";
      });
  }
}
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});