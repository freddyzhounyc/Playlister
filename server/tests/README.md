# Testing Guide

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Make sure your `.env` file is configured with the correct database connection string.

## Running Tests

### Unit Tests (Vitest)

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Loading Test Data

Load the PlaylisterData.json into your database:
```bash
npm run load-data
```

This script will:
- Create users from the JSON file (with default password "password123")
- Extract unique songs from all playlists
- Create playlists and associate them with users
- Link songs to playlists with proper ordering

**Note:** The script handles data issues gracefully and will skip invalid entries.

## Test Coverage

The unit tests cover:
- User CRUD operations
- Playlist CRUD operations
- Song CRUD operations
- PlaylistSong CRUD operations
- Edge cases (non-existent records, empty criteria, etc.)

## Postman Collection

Import `Playlister_API.postman_collection.json` into Postman to test all API endpoints.

The collection includes:
- Auth endpoints (register, login, logout, loggedIn)
- User endpoints (update)
- Playlist endpoints (CRUD, copy, listen)
- Song endpoints (CRUD, search, sort)
- PlaylistSong endpoints (add, remove, update orders)
- Error case testing

**Environment Variables:**
- `baseUrl`: http://localhost:4000
- `userId`: Set automatically after registration
- `playlistId`: Set automatically after playlist creation
- `songId`: Set automatically after song creation
- `userEmail`: Set automatically after registration
