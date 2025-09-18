# FastAPI 项目 - 后端

## 环境要求

* [Docker](https://www.docker.com/)。
* [uv](https://docs.astral.sh/uv/) 用于 Python 包和环境管理。

## Docker Compose

请参照[../development.md](../development.md)指南，使用Docker Compose启动本地开发环境。

## 基本工作流程

默认情况下，依赖项由[uv](https://docs.astral.sh/uv/)管理，请前往该页面进行安装。

在 `./backend/` 目录下可通过以下命令安装所有依赖：

```console
$ uv sync
```

随后可通过以下命令激活虚拟环境：

```console
$ source .venv/bin/activate
```

请确保编辑器使用正确的 Python 虚拟环境，解释器路径为 `backend/.venv/bin/python`。

在 `./backend/app/models.py` 中修改或添加 SQLModel 模型以管理数据和 SQL 表，在 `./backend/app/api/` 中配置 API 接口，在 `./backend/app/crud.py` 中实现 CRUD（创建、读取、更新、删除）工具。

## VS Code

已配置好通过 VS Code 调试器运行后端的设置，因此您可以使用断点、暂停和探索变量等功能。

该设置还已配置好，您可通过 VS Code 的 Python 测试选项卡运行测试。

## Docker Compose 覆盖配置

开发过程中，您可在 `docker-compose.override.yml` 文件中修改仅影响本地开发环境的 Docker Compose 设置。

该文件的修改仅作用于本地开发环境，不会影响生产环境。因此可添加临时性变更以优化开发流程。

例如，后端代码所在目录会实时同步至 Docker 容器，您修改的代码会即时复制到容器内的目录中。这使您无需重新构建 Docker 镜像即可立即测试变更。此操作仅适用于开发阶段，生产环境应使用最新版本后端代码构建 Docker 镜像。但在开发过程中，此机制能显著提升迭代速度。

另有命令覆盖机制，可执行`fastapi run --reload`替代默认的`fastapi run`。该命令仅启动单个服务器进程（而非生产环境的多进程模式），并在代码变更时自动重载进程。需注意：若Python文件存在语法错误且保存后，进程将终止并导致容器停止。此时可修复错误后重新启动容器：

```console
$ docker compose watch
```

另有注释掉的`command`覆盖选项，可取消注释并禁用默认命令。该命令使后端容器运行一个“无操作”进程以维持容器存活，从而允许您进入运行中的容器执行内部命令——例如启动Python解释器测试依赖项，或启动检测到变更时自动重载的开发服务器。

若需通过`bash`会话进入容器，请先启动堆栈：

```console
$ docker compose watch
```

随后在另一终端中执行`exec`命令进入运行中的容器：

```console
$ docker compose exec backend bash
```

此时应看到类似输出：

```console
root@7f2607af31c3:/app#
```

这表示您已进入容器内的`bash`会话，以`root`用户身份位于`/app`目录下。该目录内还有一个名为“app”的子目录，即容器中代码所在位置：`/app/app`。

在此目录中可使用`fastapi run --reload`命令启动调试实时重载服务器。

```console
$ fastapi run --reload app/main.py
```

...界面将显示：

```console
root@7f2607af31c3:/app# fastapi run --reload app/main.py
```

按下回车键后，实时重载服务器即会启动，当检测到代码变更时自动刷新。

但需注意：若检测到语法错误而非代码变更，服务器将直接停止并报错。由于容器仍处于运行状态且您处于Bash会话中，修正错误后可立即通过相同命令（按“上箭头”+“回车”）快速重启。

...正是这个细节使得保持容器空闲运行变得有价值——在 Bash 会话中，它能随时启动实时重载服务器。

## 后端测试

要测试后端，请运行：

```console
$ bash ./scripts/test.sh
```

测试使用Pytest运行，可在`./backend/app/tests/`目录下修改或添加测试用例。

若使用 GitHub Actions，测试将自动运行。

### 运行测试环境

若环境已启动且仅需运行测试，可执行：

```bash
docker compose exec backend bash scripts/tests-start.sh
```

该 `/app/scripts/tests-start.sh` 脚本在确认环境正常运行后调用 `pytest`。若需向 `pytest` 传递额外参数，可通过该命令传入，参数将被转发执行。

例如设置首次错误停止测试：

```bash
docker compose exec backend bash scripts/tests-start.sh -x
```

### 测试覆盖率

运行测试时会生成文件`htmlcov/index.html`，您可在浏览器中打开查看测试覆盖率。

## 迁移操作

由于本地开发时应用目录会被挂载为容器内的卷，您也可在容器内使用`alembic`命令执行迁移操作，迁移代码将保存在应用目录中（而非仅存在于容器内）。因此可将其添加至 Git 仓库。

每次修改模型时，请确保创建模型“修订版本”并使用该版本“升级”数据库。此操作将更新数据库表结构，否则应用程序将出现错误。

* 在后端容器中启动交互式会话：

```console
$ docker compose exec backend bash
```

* Alembic 已预配置为从 `./backend/app/models.py` 导入 SQLModel 模型。

* 修改模型（例如添加字段）后，在容器内创建修订版本，示例：

```console
$ alembic revision --autogenerate -m “在 User 模型中添加 last_name 字段”
```

* 将 alembic 目录生成的文件提交至 git 仓库。

* 创建修订后，在数据库中执行迁移（此操作将实际修改数据库）：

```console
$ alembic upgrade head
```

若完全不使用迁移功能，请取消注释`./backend/app/core/db.py`文件中以下行末尾的注释：

```python
SQLModel.metadata.create_all(engine)
```

同时注释`scripts/prestart.sh`文件中包含以下内容的行：

```console
$ alembic upgrade head
```

若希望从零开始创建模型（即不保留任何历史版本），可先删除 `./backend/app/alembic/versions/` 目录下的修订文件（`.py` Python 文件），再按上述步骤创建首个迁移。

## 邮件模板

邮件模板位于 `./backend/app/email-templates/` 目录下。该目录包含两个子目录：`build` 和 `src`。`src` 目录存放用于生成最终邮件模板的源文件，`build` 目录则存放应用程序实际使用的最终邮件模板。

继续操作前，请确保已在 VS Code 中安装 [MJML 扩展](https://marketplace.visualstudio.com/items?itemName=attilabuti.vscode-mjml)。

安装MJML扩展后，可在`src`目录中创建新邮件模板。创建模板并打开`.mjml`文件后，按`Ctrl+Shift+P`调出命令面板，搜索`MJML: Export to HTML`。该命令将`.mjml`文件转换为`.html`格式，此时即可将其保存至`build`目录。

通过DeepL.com（免费版）翻译