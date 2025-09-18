# 全栈 FastAPI 模板

<a href="https://github.com/fastapi/full-stack-fastapi-template/actions?query=workflow%3ATest" target="_blank"><img src="https://github.com/fastapi/full-stack-fastapi-template/workflows/Test/badge.svg" alt="测试"></a>
<a href="https://coverage-badge.samuelcolvin.workers.dev/redirect/fastapi/full-stack-fastapi-template" target="_blank"><img src="https://coverage-badge.samuelcolvin.workers.dev/fastapi/full-stack-fastapi-template.svg" alt="覆盖率"></a>

## 技术栈与特性

- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) 用于 Python 后端 API。
    - 🧰 [SQLModel](https://sqlmodel.tiangolo.com) 用于 Python SQL 数据库交互（ORM）。
    - 🔍 [Pydantic](https://docs.pydantic.dev) 用于数据验证和配置管理（由 FastAPI 调用）。
    - 💾 [PostgreSQL](https://www.postgresql.org) 作为 SQL 数据库。
- 🚀 [React](https://react.dev) 用于前端开发。
    - 💃 采用 TypeScript、钩子、Vite 等现代前端技术栈组件。
    - 🎨 [Chakra UI](https://chakra-ui.com) 提供前端组件库。
    - 🤖 自动生成前端客户端。
    - 🧪 [Playwright](https://playwright.dev) 用于端到端测试。
    - 🦇 支持深色模式。
- 🐋 [Docker Compose](https://www.docker.com) 用于开发与生产环境。
- 🔒 默认采用安全密码哈希算法。
- 🔑 JWT（JSON网络令牌）认证机制。
- 📫 基于邮件的密码重置功能。
- ✅ 通过[Pytest](https://pytest.org)进行测试。
- 📞 使用[Traefik](https://traefik.io)作为反向代理/负载均衡器。
- 🚢 基于Docker Compose的部署指南，包含配置前端Traefik代理以自动处理HTTPS证书的步骤。
- 🏭 基于GitHub Actions的持续集成(CI)与持续部署(CD)。

### 仪表盘登录

[![API 文档](img/login.png)](https://github.com/fastapi/full-stack-fastapi-template)

### 仪表盘 - 管理员

[![API 文档](img/dashboard.png)](https://github.com/fastapi/full-stack-fastapi-template)

### 仪表盘 - 创建用户

[![API 文档](img/dashboard-create.png)](https://github.com/fastapi/full-stack-fastapi-template)

### 仪表盘 - 项目

[![API 文档](img/dashboard-items.png)](https://github.com/fastapi/full-stack-fastapi-template)

### 仪表盘 - 用户设置

[![API 文档](img/dashboard-user-settings.png)](https://github.com/fastapi/full-stack-fastapi-template)

### 仪表盘 - 深色模式

[![API 文档](img/dashboard-dark.png)](https://github.com/fastapi/full-stack-fastapi-template)

### 互动式API文档

[![API文档](img/docs.png)](https://github.com/fastapi/full-stack-fastapi-template)

## 使用指南

您只需**直接分叉或克隆**此仓库即可直接使用。

✨ 即开即用 ✨

### 私有仓库使用方法

若需使用私有仓库，GitHub不允许直接分叉（因其不支持修改分叉可见性）。

但可采取以下操作：

- 创建新GitHub仓库，例如`my-full-stack`。
- 手动克隆本仓库，并将其名称设置为目标项目名（如`my-full-stack`）：

```bash
git clone git@github.com:fastapi/full-stack-fastapi-template.git my-full-stack
```

- 进入新目录：

```bash
cd my-full-stack
```

- 将新仓库设为远程仓库，从 GitHub 界面复制地址，例如：

```bash
git remote set-url origin git@github.com:octocat/my-full-stack.git
```

- 将此仓库添加为另一个“远程仓库”以便后续获取更新：

```bash
git remote add upstream git@github.com:fastapi/full-stack-fastapi-template.git
```

- 将代码推送到新仓库：

```bash
git push -u origin master
```

### 从原始模板更新

克隆仓库并进行修改后，您可能需要获取原始模板的最新变更。

- 确保已将原始仓库添加为远程仓库，可通过以下命令验证：

```bash
git remote -v

origin    git@github.com:octocat/my-full-stack.git (fetch)
origin    git@github.com:octocat/my-full-stack.git (push)
upstream    git@github.com:fastapi/full-stack-fastapi-template.git (fetch)
upstream    git@github.com:fastapi/full-stack-fastapi-template.git (push)
```

- 提取最新变更而不合并：

```bash
git pull --no-commit upstream master
```

这将从模板中下载最新变更而不提交，以便您在提交前检查所有内容是否正确。

- 若存在冲突，请在编辑器中解决。

- 完成后提交变更：

```bash
git merge --continue
```

### 配置

随后可通过修改`.env`文件中的配置项进行个性化设置。

部署前请务必修改以下关键值：

- `SECRET_KEY`
- `FIRST_SUPERUSER_PASSWORD`
- `POSTGRES_PASSWORD`

建议通过密钥库以环境变量形式传递这些值。

更多细节请参阅[deployment.md](./deployment.md)文档。

### 生成密钥

`.env`文件中部分环境变量默认值为`changethis`。

您必须用密钥替换这些默认值。生成密钥时可执行以下命令：

```bash
python -c “import secrets; print(secrets.token_urlsafe(32))”
```

复制生成的内容作为密码/密钥使用。再次执行该命令可生成新的安全密钥。

## 使用指南 - Copier替代方案

本仓库亦支持通过[Copier](https://copier.readthedocs.io)创建新项目。

该工具将复制所有文件，引导您完成配置问答，并根据回答更新`.env`文件。

### 安装Copier

可通过以下命令安装：

```bash
pip install copier
```

若已安装[`pipx`](https://pipx.pypa.io/)，更推荐使用：

```bash
pipx install copier
```

**注意**：若已安装`pipx`，可跳过copier安装步骤直接运行。

### 使用Copier生成项目

请为新项目目录命名（后续操作将使用该名称），例如`my-awesome-project`。

进入项目根目录，执行以下命令并替换项目名：

```bash
copier copy https://github.com/fastapi/full-stack-fastapi-template my-awesome-project --trust
```

若已安装 `pipx` 但未安装 `copier`，可直接运行：

```bash
pipx run copier copy https://github.com/fastapi/full-stack-fastapi-template my-awesome-project --trust
```

**注意**：必须使用 `--trust` 选项才能执行 [创建后脚本](https://github.com/fastapi/full-stack-fastapi-template/blob/master/.copier/update_dotenv.py)，该脚本会更新您的 `.env` 文件。

### 输入变量

生成项目前，您可能需要准备好以下数据以便 Copier 进行查询。

但无需担心，后续您可随时在 `.env` 文件中更新这些信息。

输入变量及其默认值（部分自动生成）如下：

- `project_name`：（默认值：`“FastAPI Project”`）项目名称，将展示给 API 用户（存储于 .env 文件）。
- `stack_name`：（默认值：`“fastapi-project”`）用于 Docker Compose 标签和项目名称的堆栈名称（禁止使用空格和句点）（存储于 .env 文件）。
- `secret_key`：（默认值：`“changethis”`）项目安全密钥，存储于.env文件中，可通过上述方法生成。
- `first_superuser`：（默认值：`“admin@example.com”`）首个超级用户的邮箱地址（存储于.env文件）。
- `first_superuser_password`：（默认值：`“changethis”`）首个超级用户的密码（存储于 .env 文件中）。
- `smtp_host`：（默认值：“”）用于发送邮件的 SMTP 服务器主机，可在 .env 文件中后续设置。
- `smtp_user`：（默认值：“”） 用于发送邮件的SMTP服务器用户名，可在.env中后续配置。
- `smtp_password`: (默认: “”) 用于发送邮件的SMTP服务器密码，可在.env中后续配置。
- `emails_from_email`: (默认: `“info@example.com”`) 发送邮件的邮箱账户，可在.env中后续配置。
- `postgres_password`: (默认: `“changethis”`) PostgreSQL 数据库密码，存储于 .env 中，可通过上述方法生成。
- `sentry_dsn`: (默认: “”) Sentry 的 DSN，若需使用可稍后在 .env 中设置。

## 后端开发

后端文档：[backend/README.md](./backend/README.md)。

## 前端开发

前端文档：[frontend/README.md](./frontend/README.md)。

## 部署

部署文档：[deployment.md](./deployment.md)。

## 开发指南

通用开发文档：[development.md](./development.md)。

涵盖 Docker Compose 使用、自定义本地域名、`.env` 配置等内容。

## 版本说明

请查阅文件 [release-notes.md](./release-notes.md)。

## 许可协议

本全栈 FastAPI 模板遵循 MIT 许可协议条款。
