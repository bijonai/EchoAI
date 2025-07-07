# 本地运行

## 运行环境
>
> NodeJs >= 20
>
> Docker

## 启动

1. 克隆仓库

```bash
git clone https://github.com/bijonai/echoai.git
```

2. 安装依赖

```bash
npm i # NPM
pnpm i # PNPM
bun i # Bun
```

3. 启动所需服务

EchoAI使用 [Logto](https://logto.io/), [PostgreSQL](https://www.postgresql.org/) 和 [Qdrant](https://qdrant.tech/) 作为一些模块的服务。

你可以使用 docker compose 来启动所需服务。

```bash
docker compose up -d
```

或者可以使用他们的云服务，并配置环境变量。

4. 配置环境变量

重命名根目录下的 `.env.template` 为 `.env` 并填充所需变量（包括你的 Logto, PostgreSQL, Qdrant 的API Token）。

> 模型选用推荐
>
> 环境变量中模型填写有五个，都以 `XXX_MODEL`, `XXX_MODEL_BASE_URL`, `XXX_MODEL_API_KEY`
>
> EchoAI采用Muti-Model架构，你可以根据你的需求选择不同的模型。
>
> 对于`DESIGNER_MODEL`, 不推荐使用推理模型
>
> 对于`SPEAKER_MODEL`, 推荐使用低端模型，因为对模型能力要求不高
>
> 对于`LAYOUT_MODEL`, 推荐使用速度快的小模型
>
> 对于`CHALK_MODEL`, 推荐使用输出速度快且上下文窗口大的模型
>
> 对于`EMBEDDING_MODEL`, 你可以根据你的需求选择不同的模型

5. 初始化向量知识库

你需要先克隆Sciux社区的知识库仓库:

```bash
git clone https://github.com/sciux-kit/knowledge.git
```

然后在环境变量里配置你的Qdrant和Embedding模型, Qdrant应该和EchoAI的Qdrant服务信息一致。

最后通过以下命令上传知识库到Qdrant:

```bash
npm install
npm run to-content
npm run upload
```

6. 初始化PostgreSQL

EchoAI使用DrizzleORM来操作PostgreSQL，你可以通过以下命令初始化数据库:

```bash
pnpm db:init
```

7. 启动开发服务器

```bash
pnpm dev
```
