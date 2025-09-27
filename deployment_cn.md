# FastAPI 项目 - 部署

您可以使用 Docker Compose 将项目部署到远程服务器。

本项目要求您已配置 Traefik 代理来处理外部通信，并具备 HTTPS 证书。

可通过 CI/CD（持续集成与持续部署）系统实现自动化部署，现有 GitHub Actions 配置方案可直接使用。

但您需要先完成以下配置。🤓

## 准备工作

* 准备好可用的远程服务器。
* 将域名DNS记录指向您创建的服务器IP地址。
* 为域名配置通配符子域名，以便为不同服务创建多个子域名，例如`*.fastapi-project.example.com`。这将便于访问不同组件，例如 `dashboard.fastapi-project.example.com`、`api.fastapi-project.example.com`、`traefik.fastapi-project.example.com`、`adminer.fastapi-project.example.com` 等。同样适用于 `staging` 环境，例如 `dashboard.staging.fastapi-project.example.com`、`adminer.staging.fastapi-project.example.com` 等。
* 在远程服务器上安装并配置 [Docker](https://docs.docker.com/engine/install/)（需安装 Docker Engine，而非 Docker Desktop）。

## 公共Traefik

我们需要Traefik代理来处理传入连接和HTTPS证书。

以下步骤只需执行一次。

### Traefik Docker Compose

* 创建远程目录存储Traefik Docker Compose文件：

```bash
mkdir -p /root/code/traefik-public/
```

将 Traefik Docker Compose 文件复制到服务器。可在本地终端运行 `rsync` 命令实现：

```bash
rsync -a docker-compose.traefik.yml root@your-server.example.com:/root/code/traefik-public/
```

### Traefik 公共网络

此 Traefik 需要一个名为 `traefik-public` 的 Docker “公共网络” 来与您的堆栈通信。

通过这种方式，将有一个单一的公共 Traefik 代理处理与外部世界的通信（HTTP 和 HTTPS），而在其后，您可以拥有一个或多个具有不同域名的堆栈，即使它们位于同一台服务器上也是如此。

在远程服务器执行以下命令创建名为`traefik-public`的Docker公共网络：

```bash
docker network create traefik-public
```

### Traefik环境变量

启动Traefik前需在终端设置若干环境变量。请在远程服务器执行以下命令：

* 创建HTTP基本认证用户名，例如：

```bash
export USERNAME=admin
```

* 创建HTTP基本认证密码的环境变量，例如：

```bash
export PASSWORD=changethis
```

* 使用openssl生成HTTP基本认证密码的“哈希值”并存储为环境变量：

```bash
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
```

可通过打印验证哈希密码是否正确：

```bash
echo $HASHED_PASSWORD
```

* 创建服务器域名环境变量，例如：

```bash
export DOMAIN=fastapi-project.example.com
```

* 创建用于 Let's Encrypt 的邮箱环境变量，例如：

```bash
export EMAIL=admin@example.com
```

**注意**：必须设置独立邮箱，`@example.com` 格式邮箱无效。

### 启动 Traefik Docker Compose

在远程服务器中进入 Traefik Docker Compose 文件所在目录：

```bash
cd /root/code/traefik-public/
```

完成环境变量配置并确保 `docker-compose.traefik.yml` 文件就位后，可通过以下命令启动 Traefik Docker Compose：

```bash
docker compose -f docker-compose.traefik.yml up -d
```

## 部署 FastAPI 项目

Traefik 环境就绪后，即可使用 Docker Compose 部署 FastAPI 项目。

**注意**：您可能需要跳转至 GitHub Actions 持续部署章节。

## 环境变量

首先需要设置若干环境变量。

设置 `ENVIRONMENT` 变量，默认值为 `local`（用于开发环境），但部署到服务器时应设置为 `staging` 或 `production` 等值：

```bash
export ENVIRONMENT=production
```

设置 `DOMAIN`，默认值为 `localhost`（开发环境），部署时需替换为实际域名，例如：

```bash
export DOMAIN=fastapi-project.example.com
```

可同时设置多个变量，例如：

* `PROJECT_NAME`：项目名称，用于文档和邮件中的API调用。
* `STACK_NAME`：用于 Docker Compose 标签和项目名称的堆栈名称，应为 `staging`、`production` 等环境设置不同值。可将域名中的点替换为连字符使用相同域名，例如 `fastapi-project-example-com` 和 `staging-fastapi-project-example-com`。
* `BACKEND_CORS_ORIGINS`：以逗号分隔的允许CORS来源列表。
* `SECRET_KEY`：FastAPI项目的密钥，用于签名令牌。
* `FIRST_SUPERUSER`：首个超级用户的邮箱，该用户将拥有创建新用户的权限。
* `FIRST_SUPERUSER_PASSWORD`：首个超级用户的密码。
* `SMTP_HOST`：用于发送邮件的SMTP服务器主机，需由邮件服务商提供（如Mailgun、Sparkpost、Sendgrid等）。
* `SMTP_USER`：用于发送邮件的SMTP服务器用户名。
* `SMTP_PASSWORD`：用于发送邮件的SMTP服务器密码。
* `EMAILS_FROM_EMAIL`：发送邮件的发件邮箱账户。
* `POSTGRES_SERVER`：PostgreSQL服务器的主机名。可保留默认值`db`（由同一Docker Compose提供）。除非使用第三方服务商，通常无需修改此项。
* `POSTGRES_PORT`：PostgreSQL 服务器的端口号。可保留默认值。除非使用第三方提供商，通常无需修改。
* `POSTGRES_PASSWORD`：Postgres 密码。
* `POSTGRES_USER`：Postgres 用户名，可保留默认值。
* `POSTGRES_DB`：本应用使用的数据库名称。可保留默认值 `app`。
* `SENTRY_DSN`：若使用 Sentry，则为其数据源名称（DSN）。

## GitHub Actions 环境变量

以下环境变量仅供 GitHub Actions 使用，可进行配置：

* `LATEST_CHANGES`：由 GitHub Action [latest-changes](https://github.com/tiangolo/latest-changes) 用于根据合并的 PR 自动添加发布说明。此变量为个人访问令牌，详情请参阅文档。
* `SMOKESHOW_AUTH_KEY`：用于通过[Smokeshow](https://github.com/samuelcolvin/smokeshow)处理并发布代码覆盖率，请遵循其指引创建（免费的）Smokeshow密钥。

### 生成密钥

`.env`文件中的某些环境变量默认值为`changethis`。

需用密钥替换这些默认值。生成密钥可执行以下命令：

```bash
python -c “import secrets; print(secrets.token_urlsafe(32))”
```

复制输出内容作为密码/密钥使用。再次执行该命令可生成新密钥。

### 使用 Docker Compose 部署

配置环境变量后，即可通过 Docker Compose 部署：

```bash
docker compose -f docker-compose.yml up -d
```

生产环境中不建议保留 `docker-compose.override.yml` 的覆盖配置，因此我们明确指定使用 `docker-compose.yml` 文件。

## 持续部署 (CD)

可通过 GitHub Actions 实现项目自动部署。😎

支持多环境部署。

当前已配置两个环境：`staging` 和 `production`。🚀

### 安装 GitHub Actions 运行器

* 在远程服务器创建 GitHub Actions 用户：

```bash
sudo adduser github
```

* 为`github`用户添加Docker权限：

```bash
sudo usermod -aG docker github
```

* 临时切换至`github`用户：

```bash
sudo su - github
```

* 进入`github`用户主目录：

```bash
cd
```

* [按官方指南安装 GitHub Action 自托管运行器](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/adding-self-hosted-runners#adding-a-self-hosted-runner-to-a-repository)。

* 当被问及标签时，添加环境标签（如 `production`）。您也可稍后添加标签。

安装完成后，指南会提示您运行命令启动运行器。但该进程一旦终止或本地与服务器的连接中断，运行器将停止工作。

为确保其随系统启动并持续运行，可将其安装为服务。操作步骤如下：退出`github`用户并切换回`root`用户：

```bash
exit
```

操作完成后，您将重新切换至先前用户。同时您将进入该用户所属的先前目录。

在进入`github`用户目录前，您需要切换至`root`用户（您可能已处于该用户状态）：

```bash
sudo su
```

* 以`root`用户身份进入`github`用户主目录下的`actions-runner`目录：

```bash
cd /home/github/actions-runner
```

* 以`github`用户身份将自托管运行器安装为服务：

```bash
./svc.sh install github
```

* 启动服务：

```bash
./svc.sh start
```

* 检查服务状态：

```bash
./svc.sh status
```

更多详情请参阅官方指南：[配置自托管运行器应用程序为服务](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/configuring-the-self-hosted-runner-application-as-a-service)。

### 设置密钥

在您的仓库中，为所需的环境变量配置密钥（即上述提到的 `SECRET_KEY` 等）。请遵循[GitHub官方仓库密钥设置指南](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)。

当前GitHub Actions工作流需要以下密钥：

* `DOMAIN_PRODUCTION`
* `DOMAIN_STAGING`
* `STACK_NAME_PRODUCTION`
* `STACK_NAME_STAGING`
* `EMAILS_FROM_EMAIL`
* `FIRST_SUPERUSER`
* `FIRST_SUPERUSER_PASSWORD`
* `POSTGRES_PASSWORD`
* `SECRET_KEY`
* `LATEST_CHANGES`
* `SMOKESHOW_AUTH_KEY`

## GitHub Action 部署工作流

`.github/workflows` 目录中已配置好用于部署至环境的 GitHub Action 工作流（带有标签的 GitHub Actions 运行器）：

* `staging`：在向 `master` 分支推送（或合并）代码后触发。
* `production`：在发布版本后触发。

若需添加额外环境，可将上述流程作为基础模板进行扩展。

## 网址配置

请将 `fastapi-project.example.com` 替换为您的域名。

### Traefik 主控制台

Traefik 界面：`https://traefik.fastapi-project.example.com`

### 生产环境

前端：`https://dashboard.fastapi-project.example.com`

后端 API 文档：`https://api.fastapi-project.example.com/docs`

后端API基础URL：`https://api.fastapi-project.example.com`

Adminer管理界面：`https://adminer.fastapi-project.example.com`

### 测试环境

前端：`https://dashboard.staging.fastapi-project.example.com`

后端API文档：`https://api.staging.fastapi-project.example.com/docs`

后端API基础URL：`https://api.staging.fastapi-project.example.com`

Adminer：`https://adminer.staging.fastapi-project.example.com`

