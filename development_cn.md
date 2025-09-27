# FastAPI 项目 - 开发环境

## Docker Compose

* 使用 Docker Compose 启动本地开发环境：

```bash
docker compose watch
```

* 随后可通过浏览器访问以下 URL 进行交互：

前端（基于 Docker 构建，路径解析路由）：http://localhost:5173

后端（基于 OpenAPI 的 JSON 接口）：http://localhost:8000

Swagger UI 自动生成的交互式文档（基于 OpenAPI 后端）：http://localhost:8000/docs

Adminer 数据库管理界面：http://localhost:8080

Traefik UI 监控代理路由处理：http://localhost:8090

**注意**：首次启动服务堆栈时，可能需要一分钟准备时间。后端正在等待数据库就绪并完成配置。可通过日志监控进程。

查看日志请在另一终端执行：

```bash
docker compose logs
```

查看特定服务日志需添加服务名称，例如：

```bash
docker compose logs backend
```

## 本地开发环境

Docker Compose配置文件确保每个服务在`localhost`上使用不同端口。

后端与前端服务采用本地开发服务器相同的端口，因此后端访问地址为`http://localhost:8000`，前端为`http://localhost:5173`。

通过这种方式，你可以关闭 Docker Compose 服务并启动其本地开发服务，所有功能仍能正常运行，因为它们使用相同的端口。

例如，你可以在 Docker Compose 中停止 `frontend` 服务，在另一个终端中运行：

```bash
docker compose stop frontend
```

然后启动本地前端开发服务器：

```bash
cd frontend
npm run dev
```

或者你可以停止 `backend` Docker Compose 服务：

```bash
docker compose stop backend
```

然后你可以运行后端的本地开发服务器：

```bash
cd backend
fastapi dev app/main.py
```

## `localhost.tiangolo.com` 中的 Docker Compose

启动 Docker Compose 堆栈时，默认使用 `localhost`，每个服务（后端、前端、adminer 等）分配不同端口。

部署至生产环境（或预发布环境）时，每个服务将部署在独立子域名下，例如后端为 `api.example.com`，前端为 `dashboard.example.com`。

在[部署指南](deployment.md)中可查阅配置代理Traefik的相关说明。该组件负责根据子域名将流量转发至对应服务。

若需本地测试整体功能，可编辑本地`.env`文件，将：

```dotenv
DOMAIN=localhost.tiangolo.com
```

此配置将被 Docker Compose 文件用于设置服务的基础域名。

Traefik 将据此将 `api.localhost.tiangolo.com` 的流量转发至后端，并将 `dashboard.localhost.tiangolo.com` 的流量转发至前端。

域名 `localhost.tiangolo.com` 是一个特殊域名（含所有子域名），其配置指向 `127.0.0.1`。本地开发时可使用该域名。

更新后请重新执行：

```bash
docker compose watch
```

部署时（例如生产环境），主Traefik配置需在Docker Compose文件外部完成。本地开发环境中，`docker-compose.override.yml`内置了Traefik配置，仅用于验证域名是否正常工作，例如`api.localhost.tiangolo.com`和`dashboard.localhost.tiangolo.com`。

## Docker Compose 文件与环境变量

存在一个主配置文件 `docker-compose.yml`，其中包含适用于整个堆栈的所有配置，该文件会被 `docker compose` 自动调用。

此外还有一个 `docker-compose.override.yml` 文件，用于开发环境的覆盖配置，例如将源代码挂载为卷。该文件会被 `docker compose` 自动调用，用于覆盖 `docker-compose.yml` 的配置。

这些 Docker Compose 文件会调用 `.env` 文件，将其中配置注入为容器环境变量。

同时也会从执行 `docker compose` 命令前的脚本环境变量中获取额外配置。

修改变量后请务必重启堆栈：

```bash
docker compose watch
```

## .env文件

`.env`文件存储所有配置项、生成的密钥及密码等敏感信息。

根据工作流需求，您可能需要将其排除在Git版本控制之外（例如项目公开时）。此时需确保CI工具在构建或部署项目时能获取该文件。

可行的方案是将每个环境变量添加至 CI/CD 系统，并修改 `docker-compose.yml` 文件使其读取特定环境变量而非 `.env` 文件。

## 提交前检查与代码格式化

我们使用名为 [pre-commit](https://pre-commit.com/) 的工具进行代码格式化检查。

安装后，该工具会在 Git 提交前自动运行，确保代码在提交前保持格式一致性。

项目根目录下存放着配置文件 `.pre-commit-config.yaml`。

#### 安装预提交工具实现自动运行

`pre-commit`已作为项目依赖项存在，但若需全局安装，可参照[官方文档](https://pre-commit.com/)操作。

安装并获取 `pre-commit` 工具后，需在本地仓库中“安装”该工具，使其能在每次提交前自动运行。

使用 `uv` 工具可执行以下命令：

```bash
❯ uv run pre-commit install
pre-commit installed at .git/hooks/pre-commit
```

现在每次尝试提交时（例如执行：

```bash
git commit
```

...pre-commit 就会运行，检查并格式化即将提交的代码，并要求您再次使用 git 添加（暂存）该代码后再提交。

随后您可以再次对修改/修复的文件执行 `git add`，此时即可提交。

#### 手动运行预提交钩子

您也可手动对所有文件运行 `pre-commit`，使用 `uv` 工具执行：

```bash
❯ uv run pre-commit run --all-files
检查新增大文件.................................. ............通过
检查 toml............................................................... 通过
检查 yaml...............................................................通过
ruff......................... ............................................通过
ruff-format................................................. .............通过
eslint................................................................... 通过
prettier.................................................................通过
```

## 网址

生产环境或预发布环境的网址将使用相同的路径，但需替换为您的域名。

### 开发环境网址

用于本地开发的网址。

前端：http://localhost:5173

后端：http://localhost:8000

自动交互文档（Swagger UI）：http://localhost:8000/docs

自动替代文档（ReDoc）：http://localhost:8000/redoc

Adminer：http://localhost:8080

Traefik UI：http://localhost:8090

MailCatcher：http://localhost:1080

### 已配置 `localhost.tiangolo.com` 的开发地址

用于本地开发的地址。

前端：http://dashboard.localhost.tiangolo.com

后端：http://api.localhost.tiangolo.com

自动交互式文档（Swagger UI）：http://api.localhost.tiangolo.com/docs

自动替代文档（ReDoc）：http://api.localhost.tiangolo.com/redoc

Adminer：http://localhost.tiangolo.com:8080

Traefik UI：http://localhost.tiangolo.com:8090

MailCatcher：http://localhost.tiangolo.com:1080