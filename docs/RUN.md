# Local Deployment

## Environment Requirements
>
> NodeJs >= 20
>
> Docker

## Getting Started

1. Clone the Repository

```bash
git clone https://github.com/bijonai/echoai.git
```

2. Install Dependencies

```bash
npm i # NPM
pnpm i # PNPM
bun i # Bun
```

3. Start Required Services

EchoAI uses [Logto](https://logto.io/), [PostgreSQL](https://www.postgresql.org/), and [Qdrant](https://qdrant.tech/) for some module services.

You can use Docker Compose to start the required services.

```bash
docker compose up -d
```

Alternatively, you can use their cloud services and configure the environment variables.

4. Configure Environment Variables

Rename the `.env.template` file in the root directory to `.env` and fill in the required variables (including your Logto, PostgreSQL, and Qdrant API tokens).

> Model Selection Recommendations
>
> The environment variables for models include five sets, each with `XXX_MODEL`, `XXX_MODEL_BASE_URL`, and `XXX_MODEL_API_KEY`.
>
> EchoAI uses a Multi-Model architecture, allowing you to choose different models based on your needs.
>
> For `DESIGNER_MODEL`, inference models are not recommended.
>
> For `SPEAKER_MODEL`, a lower-end model is recommended as it has lower capability requirements.
>
> For `LAYOUT_MODEL`, a fast, lightweight model is recommended.
>
> For `CHALK_MODEL`, a model with fast output and a large context window is recommended.
>
> For `EMBEDDING_MODEL`, you can select a model based on your specific needs.

5. Initialize the Vector Knowledge Base

First, clone the Sciux community knowledge base repository:

```bash
git clone https://github.com/sciux-kit/knowledge.git
```

Then, configure your Qdrant and Embedding model in the environment variables. The Qdrant configuration should match the Qdrant service information used by EchoAI.

Finally, upload the knowledge base to Qdrant with the following commands:

```bash
npm install
npm run to-content
npm run upload
```

6. Initialize PostgreSQL

EchoAI uses DrizzleORM to interact with PostgreSQL. You can initialize the database with the following command:

```bash
pnpm db:init
```

7. Start the Development Server

```bash
pnpm dev
```
