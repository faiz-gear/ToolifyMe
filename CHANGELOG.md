# 更新日志

所有项目的更新都会记录在这个文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

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
