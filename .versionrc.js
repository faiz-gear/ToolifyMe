module.exports = {
  types: [
    { type: 'feat', section: '✨ Features | 新功能' },
    { type: 'fix', section: '🐛 Bug Fixes | Bug 修复' },
    { type: 'perf', section: '⚡ Performance Improvements | 性能优化' },
    { type: 'revert', section: '⏪ Reverts | 回退' },
    { type: 'chore', section: '📦 Chores | 其他更新' },
    { type: 'docs', section: '📝 Documentation | 文档' },
    { type: 'style', section: '💄 Styles | 风格' },
    { type: 'refactor', section: '♻️ Code Refactoring | 代码重构' },
    { type: 'test', section: '✅ Tests | 测试' },
    { type: 'build', section: '👷‍ Build System | 构建' },
    { type: 'ci', section: '🔧 Continuous Integration | CI 配置' }
  ],
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}} 🎸',
  header: '# 更新日志 \n\n',
  skip: {
    bump: false,
    changelog: false,
    commit: false,
    tag: false
  }
}
