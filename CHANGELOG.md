# 更新日志

### 0.1.1 (2024-11-21)

### ♻️ Code Refactoring | 代码重构

- adjust husky ([4a138ce](https://github.com/faiz-gear/ToolifyMe/commit/4a138ce8d8882e9752aa587865e7f15808c73198))

### 📦 Chores | 其他更新

- update typescript eslint to v6.21.0 and add parser ([e846a39](https://github.com/faiz-gear/ToolifyMe/commit/e846a39ec2701c9cb5dd8feef062b95fddbf49a2))

### 🐛 Bug Fixes | Bug 修复

- build failed ([71aaebf](https://github.com/faiz-gear/ToolifyMe/commit/71aaebf564cea643b7fe85e1fa49007675dd8b2f))

### ✨ Features | 新功能

- add image compressor ([5da6b24](https://github.com/faiz-gear/ToolifyMe/commit/5da6b244f08a4945aec6047784aab41923a62a6f))
- add image to pdf tool ([f26efde](https://github.com/faiz-gear/ToolifyMe/commit/f26efde9bdf3cd9715e98925107a83347ae05396))
- app directory structure optimization; optimize sidebar code ([e75dfea](https://github.com/faiz-gear/ToolifyMe/commit/e75dfea2d4098fa37de70c0e6d5f0e99efdbd4a2))
- change dev script to use port 5858 ([2429ad0](https://github.com/faiz-gear/ToolifyMe/commit/2429ad09327d81484374c5ff6d09723476c58385))

### 🔧 Continuous Integration | CI 配置

- intergration changelog ([063d292](https://github.com/faiz-gear/ToolifyMe/commit/063d292b1a0e5b44435d629568243ebc93c49886))

## [0.1.0] - 2024-03-21

### ✨ Features | 新功能

- **PDF工具**

  - PDF转图片功能
    - 支持多页PDF文件处理
    - 支持JPG/PNG格式导出
    - 支持调整输出图片质量
    - 支持预览和放大查看
    - 支持单页/批量下载
    - 支持拖拽上传

- **图片工具**
  - 图片转PDF功能
    - 支持多图片上传
    - 支持拖拽排序
    - 支持预览图片
    - 支持删除已选图片
    - 支持自动调整图片大小适应PDF页面
    - 支持常见图片格式（PNG、JPG、JPEG、GIF）

### 🔧 Continuous Integration | CI 配置

- 集成 husky 进行 Git 提交规范控制
- 集成 commitlint 进行提交信息规范检查
- 集成 commitizen 辅助生成规范的提交信息
- 集成 standard-version 自动生成更新日志
- 集成 ESLint 和 Prettier 进行代码规范控制

### 📝 Documentation | 文档

- 创建项目 README.md，包含功能说明和开发计划
- 添加 CHANGELOG.md 记录版本更新历史

### 👷 Build System | 构建

- 使用 Next.js 14 框架搭建项目
- 集成 TypeScript 进行类型检查
- 集成 Tailwind CSS 进行样式管理
- 集成多个 UI 组件库优化用户体验
