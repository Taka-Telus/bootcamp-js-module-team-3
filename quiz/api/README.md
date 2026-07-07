# API — Quiz App

**Base URL:** `https://quiz-api.cesar-kastli.workers.dev/`

To explore the endpoints with a visual interface, download [Bruno](https://www.usebruno.com/) and import `quiz-api-bruno.tar.gz` from this folder. Select **Production** in the Environment dropdown.

---

## Endpoints

### Health check
```
GET /
```

### Games

| Method | Path | Description | Body |
|--------|------|-------------|------|
| `GET` | `/games` | List all games | — |
| `POST` | `/games` | Create a game | `{ title, author, image }` |
| `GET` | `/games/:id` | Get a full game | — |
| `PATCH` | `/games/:id` | Edit a game | `{ title?, image?, questions? }` |
| `DELETE` | `/games/:id` | Delete a game (and its scores) | — |

### Scores

| Method | Path | Description | Body |
|--------|------|-------------|------|
| `GET` | `/games/:id/scores` | List scores (highest to lowest) | — |
| `POST` | `/games/:id/scores` | Submit a score | `{ playerName, score }` |

---

## Game object structure

```json
{
  "id": "abc123",
  "title": "Football History",
  "author": "Team 1",
  "image": "https://...",
  "questions": [
    {
      "text": "In what year was the first World Cup?",
      "options": [
        "1930",
        "1950",
        "1920",
        "1940"
      ]
    }
  ]
}
```

> ⚠️ `options[0]` is **always the correct answer**. When displaying options on screen, shuffle them with `sort(() => Math.random() - 0.5)` so the correct answer isn't always first.

---
