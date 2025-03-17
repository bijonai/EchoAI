![cover](./public/title.png)

EchoAI is a open-source LLM applied on education with a whiteboard and step-by-step teaching mode, which could become your best learning partner or teacher. You can use it to learning mathematics, physics, computer science and whatever you could imagine.

## 📚 Features

1. **Interactive Whiteboard**
   - Powered by our open-source DSL engine [Sciux](https://github.com/sciux-kit)
   - Rich vector graphics with interactive components
   - Comprehensive toolset for math, physics, and diagrams
   - Built-in animations and transitions
   - Components include: coordinate systems, functions, flowcharts, mindmaps, and more

2. **Smart Teaching Assistant**
   - AI-powered step-by-step teaching
   - Adaptive learning path based on user feedback
   - Dynamic branching for alternative explanations
   - Built-in reasoning model for accurate content

3. **Lesson Marketplace**
   - Browse and use pre-designed lesson plans
   - Community-driven content sharing
   - Customizable teaching materials

## ⚙️ Tech Stack

|  Frontend  | Backend | Services | Tools | LLM |
| ---------- | ------- | -------- | ----- | --- |
| TypeScript | Nitro | Logto | PNPM | DeepSeek |
|    React   | NodeJs | PostgreSQL | Python | ChatGPT |
|   NextJs   | Drizzle | Qdrant | | Claude |
| TailwindCSS | Logto Node | | | Qwen |
| D3 | OpenAI SDK | | | Gemini |
| Logto SDK | | | | |

## 🛠️ Development

### Environment
>
> NodeJs >= 20
>
> PNPM >= 9
>
> Docker
>
> Python >= 3.10

### Start

1. Clone the repository

```bash
git clone https://github.com/bijonai/echoai.git
```

2. Install dependencies

```bash
pnpm i
```

3. Launch the required services

You need to launch [Logto](https://logto.io/), [PostgreSQL](https://www.postgresql.org/) and [Qdrant](https://qdrant.tech/) to start the development environment.

4. Setup environment variables

Rename `.env.template` in the root to `.env` and fill in the required variables (include your Logto and PostgreSQL credentials).

5. Initialize database

```bash
pnpm db:init
```

6. Initialize knowledge base

```bash
pnpm knowledge:init
```

7. Start the development server

```bash
pnpm compose:dev
```

## 📦 Packages

| Package | Description |
| ------- | ----------- |
| `@echoai/api` | Front-end functions to fetch server |
| `@echoai/server` | Backend server |
| `@echoai/utils` | Utility functions for workflow |
| `@echoai/web` | NextJS web app |
| `@echoai/workflow` | Workflow for AI |

## 🤝 Contributors

![contributors](https://opencollective.com/bijonai/contributors.svg)

## 🌟 Star history

[![Star History Chart](https://api.star-history.com/svg?repos=bijonai/echoai&type=Date)](https://star-history.com/#bijonai/echoai&Date)

***Copyright (c) 2025 BijonAI Team***
