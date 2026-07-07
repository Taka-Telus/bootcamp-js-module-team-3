# JS Final Project — Quiz App · Team [X]

JavaScript Bootcamp 2026 · GM2 Dev

## Team Members

| Name | GitHub |
|------|--------|
| [Name 1] | [@username1](https://github.com/username1) |
| [Name 2] | [@username2](https://github.com/username2) |

## All Teams

| Team | Members |
|------|---------|
| Team 1 | Gonza + Julieta |
| Team 2 | Mayra + Tobias |
| Team 3 | Giovanni + Santi |
| Team 4 | Jeremias + Mateo |

---

## The Project

A multiplayer Quiz app. Players can create games with questions, play them, and compete for the highest score.

**Design (Figma):** [Bootcamp 2026 — Quiz](https://www.figma.com/design/dhgERRh0XuPsIApMxSmsMT/Bootcamp-2026?node-id=1-474&t=AlFGfaOOhEuS90ZK-0)

**API:** `https://quiz-api.cesar-kastli.workers.dev/`

To explore the API visually, download [Bruno](https://www.usebruno.com/) and import the collection file from `proyecto-final/api/quiz-api-bruno.tar.gz`. Select **Production** in the Environment dropdown.

---

## Workflow

### Branch per feature

1. Create a branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/feature-name
   ```

2. Work on the feature, commit often with descriptive messages:
   ```bash
   git add .
   git commit -m "feat: show game list from API"
   ```

3. Push the branch and open a PR:
   ```bash
   git push origin feat/feature-name
   ```

4. Fill out the PR template and wait for the teacher's review.

5. **Do not merge without approval** — only teachers can merge to `main`.

### Rules

- ❌ No direct pushes to `main`
- ❌ Do not merge your own PR
- ✅ Descriptive branch names: `feat/game-screen`, `fix/fetch-error`, `feat/settings-localstorage`
- ✅ Complete the PR checklist before requesting review
- ✅ If something doesn't work, leave a comment explaining what you tried and describe it in the PR

---

## Structure

```
quiz/
  index.html    ← HTML shell (single page, 6 screens)
  styles.css    ← styles (you create this)
  app.js        ← main logic (you create this)
  api/          ← API documentation
bruno/          ← Add bruno test playground when needed
docs/           ← Add project documentation
```

---

## Acceptance Criteria

See [`TP modulo JS`](https://telusinternational.enterprise.slack.com/docs/T0B532ZNW/F0BGB40H788) for the full list.
