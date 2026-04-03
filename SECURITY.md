# 安全策略

## 受支持版本

我们会为以下版本提供安全漏洞修复：

| 版本 | 是否支持 |
| --- | --- |
| 最新版本 | ✅ |
| 旧于最新版本 | ❌ |

建议始终使用最新版本，以便及时获得安全修复。

## 漏洞报告方式

我们非常重视这些包的安全性。如果你发现了安全漏洞，请使用以下方式报告。

### 在哪里报告

请通过 GitHub 创建 [Security Advisory](https://github.com/AnnAngela/eslint-packages/security/advisories/new)，或直接联系维护者 [@AnnAngela](https://github.com/AnnAngela)。

**请不要通过公开 Issue 报告安全漏洞。**

### 报告时建议包含的信息

- 漏洞类型（例如 XSS、SQL 注入等）
- 受影响的包及版本
- 可复现问题的步骤
- PoC 或利用代码（如有）
- 漏洞影响范围
- 你已知的临时缓解方案（如有）

### 你可以期待什么

- **已收到确认**：48 小时内确认收到报告
- **初步评估**：评估漏洞严重性与影响范围
- **处理进度更新**：在修复过程中持续同步进展
- **问题解决**：修复后发布补丁，并在适当时公开披露（如你愿意，可附带致谢）

### 响应时间目标

- **首次响应**：48 小时内
- **状态更新**：7 天内
- **修复时间**：根据严重程度而定
  - Critical：7 天内
  - High：14 天内
  - Medium：30 天内
  - Low：90 天内

## 安全最佳实践

### 面向包使用者

1. **及时升级**：尽量保持在最新版本，以获取安全补丁
2. **检查配置**：确认 ESLint 配置符合你的安全要求
3. **启用安全规则**：`@annangela/eslint-config` 内置了 `eslint-plugin-security`
4. **审计依赖**：定期执行 `npm audit` 或同类工具检查依赖风险

### 面向贡献者与维护者

1. **代码评审**：所有代码改动都应经过审查后再合并
2. **依赖更新**：定期关注依赖升级与安全公告
3. **安全编码**：避免引入新的漏洞模式
4. **测试覆盖**：对安全敏感逻辑补充必要测试
5. **敏感信息保护**：不要提交任何密钥、凭据或敏感数据

## 仓库中的安全相关能力

### `eslint-plugin-security`

`@annangela/eslint-config` 集成了 `eslint-plugin-security`，可帮助发现例如以下问题：

- 潜在的安全热点
- 不安全的正则表达式
- 不安全的 `eval()` 使用
- Buffer 使用问题
- 以及其他常见风险模式

### Node.js 版本支持

仓库仅支持仍在维护中的 Node.js LTS 版本（当前为 `^20.19 || ^22.21 || ^24.11`），以尽量确保运行环境具备最新安全更新。

## 披露策略

- 我们会与报告者协同安排漏洞披露时间
- 更倾向于协调披露，以便先完成修复与验证，再公开说明
- 对负责任披露漏洞的研究者，我们会在其同意的前提下给予致谢
- 安全公告会发布在 GitHub 与相关发布说明中

## 安全致谢

我们感谢帮助提升项目安全性的研究者与贡献者。对于有效的安全漏洞报告，我们会在获得许可后在此致谢。

*当前还没有已公开记录的安全漏洞报告。*

## 联系方式

如有安全相关问题，请联系：

- GitHub：[@AnnAngela](https://github.com/AnnAngela)
- Security Advisories：[新建安全公告](https://github.com/AnnAngela/eslint-packages/security/advisories/new)

## 相关资源

- [行为准则](CODE_OF_CONDUCT.md)
- [贡献与维护指南](CONTRIBUTING.md)
- [npm 安全最佳实践](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [GitHub 安全功能](https://docs.github.com/en/code-security)

---

*本安全策略可能随着项目维护情况调整，请以仓库中的最新版本为准。*
