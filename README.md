# 🚀 Darun React Kit CLI

A friendly CLI tool to scaffold React projects with **Vite, TailwindCSS, React Router, and Axios** pre-configured. Skip boilerplate setup and start building right away.

---

## 📦 Installation

You can use `npx` without installing globally:

```bash
npx create-darun-react my-app
```

Or install globally:

```bash
npm install -g create-darun-react
create-darun-react my-app
```

---

## ⚡ Usage

```bash
npx create-darun-react [options] [projectName]
```

### Examples

```bash
# Create a JS project interactively
npx create-darun-react my-app

# Create a TypeScript project
npx create-darun-react my-app --ts

# Skip prompts, use defaults
darun-react-kit my-app -y

# Skip git initialization
npx create-darun-react my-app --no-git
```

---

## 🎛️ CLI Options

| Option          | Description                                   |
| --------------- | --------------------------------------------- |
| `[projectName]` | Name of the project (default: `my-darun-app`) |
| `--ts`          | Use TypeScript template                       |
| `--no-git`      | Skip git initialization                       |
| `-y, --yes`     | Skip all prompts and use defaults             |

---

## 🗂️ What It Does

1. Shows a **Darun React Kit** banner 🎉
2. Asks for project name (or uses CLI argument/default)
3. Lets you pick **JavaScript** or **TypeScript**
4. Lets you choose your package manager (`npm`, `yarn`, `pnpm`)
5. Clones the template repo (`main` or `ts` branch)
6. Cleans up old `.git` and updates `package.json`
7. Creates a sample `.env`
8. Installs dependencies automatically
9. Initializes git repo (unless `--no-git` is used)

---

## 📖 Next Steps

After setup completes:

```bash
cd my-app
npm run dev
```

Open your browser at the shown URL (usually [http://localhost:5173](http://localhost:5173)).

---

## 🤝 Contributing

Found a bug or want a feature? Open an issue or PR on GitHub:

👉 [darun-react-kit](https://github.com/RaunakDiesFromCode/darun-react-kit)

---

## 📜 License

MIT License. Free to use, modify, and share.
