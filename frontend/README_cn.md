# FastAPI 项目 - 前端

前端基于 [Vite](https://vitejs.dev/)、[React](https://reactjs.org/)、[TypeScript](https://www.typescriptlang.org/)、[TanStack Query](https://tanstack.com/query)、 [TanStack Router](https://tanstack.com/router) 以及 [Chakra UI](https://chakra-ui.com/) 构建。

## 前端开发

开始前，请确保系统已安装 Node 版本管理器 (nvm) 或 Fast Node 管理器 (fnm)。

* 安装 fnm 请遵循[官方 fnm 指南](https://github.com/Schniz/fnm#installation)。若偏好 nvm，可通过[官方 nvm 指南](https://github.com/nvm-sh/nvm#installing-and-updating)进行安装。

* 安装 nvm 或 fnm 后，进入 `frontend` 目录：

```bash
cd frontend
```
* 若系统未安装`.nvmrc`文件指定的Node.js版本，请使用对应命令安装：

```bash
# 使用fnm时
fnm install

# 使用nvm时
nvm install
```

* 安装完成后切换至已安装版本：

```bash
# 使用 fnm 时
fnm use

# 使用 nvm 时
nvm use
```

* 在 `frontend` 目录内安装必要 NPM 包：

```bash
npm install
```

* 通过以下 `npm` 脚本启动实时服务器：

```bash
npm run dev
```

* 随后在浏览器中访问 http://localhost:5173/。

请注意：此实时服务器不在 Docker 中运行，仅用于本地开发，这是推荐的工作流程。当前端开发完成后，可构建前端 Docker 镜像并启动，以在接近生产环境的条件下测试。但每次修改都构建镜像的效率，远不及运行支持实时重载的本地开发服务器。

查看 `package.json` 文件了解其他可用选项。

### 移除前端

若开发纯API应用需移除前端，可按以下步骤操作：

* 删除`./frontend`目录。

* 在`docker-compose.yml`文件中移除整个`frontend`服务/配置块。

* 在 `docker-compose.override.yml` 中移除 `frontend` 和 `playwright` 服务/配置块。

完成！您已获得无前端（纯API）应用。🤓

---

若需进一步操作，还可从以下位置移除 `FRONTEND` 环境变量：

* `.env`
* `./scripts/*.sh`

但这仅是清理操作，保留这些变量实际并无影响。

## 生成客户端

### 自动生成

* 激活后端虚拟环境。
* 在项目根目录运行脚本：

```bash
./scripts/generate-client.sh
```

* 提交变更。

### 手动方式

* 启动 Docker Compose 堆栈。

* 从 `http://localhost/api/v1/openapi.json` 下载 OpenAPI JSON 文件，并将其复制到 `frontend` 目录根目录下的新文件 `openapi.json` 中。

* 运行以下命令生成前端客户端：

```bash
npm run generate-client
```

* 提交更改。

注意：每次后端变更（修改 OpenAPI 模式）时，需重新执行上述步骤更新前端客户端。

## 使用远程 API

若需使用远程 API，可将环境变量 `VITE_API_URL` 设置为远程 API 的 URL。例如可在 `frontend/.env` 文件中配置：

```env
VITE_API_URL=https://api.my-domain.example.com
```

运行前端时，系统将自动采用该地址作为API基础URL。

## 代码结构

前端代码结构如下：

* `frontend/src` - 前端主体代码。
* `frontend/src/assets` - 静态资源目录。
* `frontend/src/client` - 生成的 OpenAPI 客户端。
* `frontend/src/components` - 前端各组件文件。
* `frontend/src/hooks` - 自定义钩子函数目录。
* `frontend/src/routes` - 前端路由配置（包含页面路径）。
* `theme.tsx` - Chakra UI 自定义主题。

## 使用 Playwright 进行端到端测试

前端包含基于 Playwright 的初始端到端测试。运行测试需确保 Docker Compose 堆栈已启动。使用以下命令启动堆栈：

```bash
docker compose up -d --wait backend
```

随后可通过以下命令运行测试：

```bash
npx playwright test
```

您也可在UI模式下运行测试，实时查看浏览器运行状态并进行交互：

```bash
npx playwright test --ui
```

停止并清除Docker Compose堆栈及测试生成的数据，请使用以下命令：

```bash
docker compose down -v
```

要更新测试，请导航至 tests 目录，根据需要修改现有测试文件或添加新文件。

有关编写和运行 Playwright 测试的更多信息，请参阅官方 [Playwright 文档](https://playwright.dev/docs/intro)。
