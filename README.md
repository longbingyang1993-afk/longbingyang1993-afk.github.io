# 龙兵阳 · 个人网站

水处理自控工程师的个人主页，纯手写 HTML / CSS / JS，零框架、零 CDN 依赖。

## 本地预览

```bash
# 任选一种
python -m http.server 8080
# 或
npx serve .
```

然后打开 http://localhost:8080

## 文件结构

```
personal-site/
├─ index.html            # 全部内容（改文字就改这里）
├─ assets/
│  ├─ css/style.css      # 样式与响应式
│  └─ js/main.js         # 动效、打字机、复制、导航
├─ favicon.svg
└─ README.md
```

## 上线前要替换的占位内容

| 位置 | 现在 | 换成 |
|---|---|---|
| Hero 三个数字 | 8+ / 40+ / 12 | 真实年限、系统套数、水站数量 |
| 联系方式 | longbingyang@example.com / LBY_water / github.com/longbingyang | 真实邮箱、微信号、GitHub 主页 |
| 项目案例 | 6 个行业通用示例 | 你实际做过的项目（工艺、规模、你负责的部分） |
| 经历时间线 | 2016 起的示例路径 | 真实岗位与年份 |
| 头像 | `LBY` 占位块 | 把照片放到 `assets/img/avatar.jpg`，按 index.html 里注释替换 |

## 部署到 GitHub Pages

1. 建仓库（推荐仓库名 `longbingyang.github.io`，访问地址最干净）
2. 把本目录内容推到 `main` 分支
3. 仓库 Settings → Pages → Source 选 `Deploy from a branch` → `main` / `/ (root)`
4. 等 1–2 分钟，访问 `https://<用户名>.github.io`

## 说明

- `.nojekyll` 已包含，避免 GitHub Pages 用 Jekyll 处理静态文件
- 颜色、字体、间距都在 `assets/css/style.css` 顶部的 `:root` 里
