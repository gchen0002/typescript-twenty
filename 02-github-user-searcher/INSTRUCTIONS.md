# Project 02: GitHub User Searcher - TypeScript Implementation Guide

This guide breaks down the logic into manageable blocks. Writing this manually will help you understand **Async/Await**, **API Interactions**, and **DOM Manipulation** in TypeScript.

## Step 1: Define the Data Structure (Interface)

**Reasoning**: TypeScript needs to know the "shape" of the data we get from the GitHub API. This gives us autocomplete (IntelliSense) and prevents us from trying to access properties that don't exist.

**Directions**:
Create an interface that matches the GitHub User API response. You don't need every field, just the ones we display.

```typescript
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
}
```

## Step 2: Select DOM Elements

**Reasoning**: We need references to the HTML elements so we can update their content dynamically. Use `getElementById` or `querySelector`.

**Directions**:
Select the search input, button, and all the profile fields (name, bio, repos, etc.). Type assertion (`as HTMLImageElement`, etc.) is often needed because TypeScript doesn't parse your HTML file to know what ID matches what tag.

```typescript
const searchInput = document.getElementById('user-input') as HTMLInputElement;
const searchBtn = document.getElementById('search-btn') as HTMLButtonElement;
const avatar = document.getElementById('avatar') as HTMLImageElement;
const nameElement = document.getElementById('name') as HTMLElement;
// ... select the rest (repos, followers, location, etc.)
```

## Step 3: Fetching Data (The API Call)

**Reasoning**: We need to get data from GitHub. The `fetch` API is asynchronous (it takes time). We use `async/await` to write code that looks synchronous but waits for the result without freezing the page.

**Directions**:
Create an `async` function. content:
1.  **Fetch**: Call `fetch('https://api.github.com/users/' + username)`.
2.  **Check Error**: If `!response.ok`, throw an error or show "No results".
3.  **Parse JSON**: `await response.json()`.
4.  **Return**: The data (typed as `UserData`).

```typescript
async function fetchUser(username: string): Promise<UserData | null> {
  const response = await fetch(`https://api.github.com/users/${username}`);
  if (!response.ok) {
    // Show error message
    return null;
  }
  return response.json();
}
```

## Step 4: Updating the UI

**Reasoning**: Once we have the data object, we need to shove it into the HTML elements we selected in Step 2.

**Directions**:
Create a function `returnUser(data: UserData)`.
- Key Logic: Check if fields like `location` or `bio` are `null`. If so, show "Not Available" or modify transparency/opacity.
- Format Dates: The API returns ISO dates (`2011-01-25T...`). You might want to format that nicely.

```typescript
function updateUI(user: UserData) {
  avatar.src = user.avatar_url;
  nameElement.innerText = user.name || user.login; // Fallback to login if name is null
  // ... update other fields
  
  // Handle nulls
  if (!user.location) {
     locationElem.innerText = "Not Available";
     locationElem.style.opacity = "0.5";
  } else {
     locationElem.innerText = user.location;
  }
}
```

## Step 5: Wiring Event Listeners

**Reasoning**: The code should run when the user does something (clicks "Search" or presses "Enter").

**Directions**:
Add an event listener to the button.
Also, it's a good user experience to search when pressing "Enter" in the input box.

```typescript
searchBtn.addEventListener('click', () => {
  const user = searchInput.value;
  if (user) {
    // Call your fetch function, then update logic
  }
});
```

Good luck!
