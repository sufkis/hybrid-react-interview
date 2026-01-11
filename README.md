# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running the app

After cloning the project to a local directory,
Open cmd in that same directory and run the command:

```bash
npm install
```

After installation is done, run:

```bash
npm start
```

This should run the app.

Once the server is running, open your browser and navigate to `http://localhost:3000/`.

### Time Spent

~5.5 hours.

### Architecture Desciosions

#### Frontend stack:
- React + TypeScript for type safety and scalable component design
- Context API for global prompt state (CRUD + persistence)
- LocalStorage as the persistence layer (no backend required)
- CSS Variables + CSS Modules for themeable, component-scoped styling

#### State Management:
I kept global state minimal and focused only on prompt data (CRUD + persistence).

#### UX & Scale:
Filtering, pagination, and preview logic are computed using memoized selectors in the Dashboard component.
Pagination is implemented at the container level so it can later be swapped for virtualization if the prompt list grows large.

#### Template Engine:
The template engine is built as pure functions:
- extractVariables() parses {variables} in real-time
- buildPreview() generates a live final prompt
To allow dynamic inputs, de-duplication, and safe handling of removed or renamed variables.

#### Theming:
Dark/Light mode is handled using CSS variables and a global theme toggle stored in LocalStorage.
This allows the entire UI (header, lists, modal, inputs, preview) to change theme without rewriting component styles.

### One thing I would improve with more time

I would improve the Loading... text with something more "alive" like an animation.

### Any assumptions I made

1. Prompts would have id, title, category, template.
2. Categories are a predefined enum (Coding/Writing/Marketing/Other).
3. Variables would be detected using single braces {}; whitespace inside braces is trimmed, duplicates would produce a single input, and preview replaces variables with current input values (missing values are treated as empty and flagged with validation).
4. Search applies to title + template and combines with category filter using AND.
5. Data is persisted in LocalStorage and the app simulates loading (≈400ms) on initial load and on mutations for better UX.
