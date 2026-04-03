# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

We recommend always using the latest version of our packages to ensure you have the latest security fixes.

## Reporting a Vulnerability

We take the security of our packages seriously. If you discover a security vulnerability, please report it to us as follows:

### Where to Report

Please report security vulnerabilities by creating a [Security Advisory](https://github.com/AnnAngela/eslint-packages/security/advisories/new) on GitHub, or by contacting the maintainer [@AnnAngela](https://github.com/AnnAngela) directly.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

When reporting a vulnerability, please include the following information:

- Type of vulnerability (e.g., XSS, SQL injection, etc.)
- Affected package(s) and version(s)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Any potential mitigations you've identified

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours.
- **Assessment**: We will assess the vulnerability and determine its severity and impact.
- **Updates**: We will keep you informed about the progress of fixing the vulnerability.
- **Resolution**: Once the vulnerability is fixed, we will release a patch and publicly disclose the vulnerability (with credit to you, if desired).

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Within 90 days

## Security Best Practices

When using our ESLint packages, we recommend following these security best practices:

### For Package Users

1. **Keep packages updated**: Regularly update to the latest versions to get security patches.
2. **Review configurations**: Ensure your ESLint configurations follow security best practices.
3. **Use security plugins**: Our `@annangela/eslint-config` includes the `eslint-plugin-security` plugin to help catch common security issues.
4. **Audit dependencies**: Regularly run `npm audit` or `yarn audit` to check for vulnerabilities in dependencies.

### For Contributors

1. **Code review**: All code changes must go through peer review before merging.
2. **Dependency updates**: Keep dependencies up to date and review security advisories.
3. **Secure coding**: Follow secure coding practices and avoid introducing vulnerabilities.
4. **Testing**: Write tests that cover security-relevant code paths.
5. **Secrets**: Never commit secrets, credentials, or sensitive information to the repository.

## Security Features

Our packages include several security-focused features:

### eslint-plugin-security

The `@annangela/eslint-config` package includes `eslint-plugin-security` which helps detect:

- Potential security hotspots
- Unsafe regular expressions
- Unsafe uses of `eval()`
- Buffer usage issues
- And more...

### Node.js Version Support

We support only actively maintained LTS versions of Node.js (currently `^20.19 || ^22.21 || ^24.11`), ensuring you're using versions with the latest security updates.

## Disclosure Policy

- We will coordinate the disclosure of security vulnerabilities with the reporter.
- We prefer coordinated disclosure, allowing us time to develop and test a fix before public disclosure.
- We will credit security researchers who responsibly disclose vulnerabilities (unless they prefer to remain anonymous).
- Security advisories will be published on GitHub and in release notes.

## Security Hall of Fame

We appreciate the efforts of security researchers who help keep our packages secure. Contributors who report valid security vulnerabilities will be acknowledged here (with their permission).

*No vulnerabilities have been reported yet.*

## Contact

For security-related questions or concerns, please contact:

- GitHub: [@AnnAngela](https://github.com/AnnAngela)
- Security Advisories: [Create a new advisory](https://github.com/AnnAngela/eslint-packages/security/advisories/new)

## Additional Resources

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing Guidelines](https://github.com/AnnAngela/eslint-packages#readme)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [GitHub Security Features](https://docs.github.com/en/code-security)

---

*This security policy is subject to change. Please check back regularly for updates.*
