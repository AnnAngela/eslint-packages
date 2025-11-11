# AnnAngela's ESLint Packages

[![npm publish](https://github.com/AnnAngela/eslint-packages/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/AnnAngela/eslint-packages/actions/workflows/npm-publish.yml)
[![CodeQL](https://github.com/AnnAngela/eslint-packages/actions/workflows/CodeQL.yaml/badge.svg)](https://github.com/AnnAngela/eslint-packages/actions/workflows/CodeQL.yaml)
[![Linter](https://github.com/AnnAngela/eslint-packages/actions/workflows/linter.yaml/badge.svg)](https://github.com/AnnAngela/eslint-packages/actions/workflows/linter.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A collection of ESLint packages for better code quality and developer experience. This monorepo contains shared ESLint configurations, plugins, and formatters designed to work together seamlessly.

## 📦 Packages

This monorepo contains the following packages:

### [@annangela/eslint-config](packages/eslint-config)

[![npm version](https://img.shields.io/npm/v/@annangela/eslint-config.svg)](https://www.npmjs.com/package/@annangela/eslint-config)

ESLint configuration for AnnAngela's projects, supporting the latest Node.js LTS versions. Includes configurations for:

- Base JavaScript files
- Browser environments
- Node.js applications
- TypeScript projects
- ESLint plugin development
- Mocha test files

**Installation:**
```bash
npm install --save-dev @annangela/eslint-config
```

[View Package Documentation →](packages/eslint-config/README.md)

### [@annangela/eslint-formatter-gha](packages/eslint-formatter-gha)

[![npm version](https://img.shields.io/npm/v/@annangela/eslint-formatter-gha.svg)](https://www.npmjs.com/package/@annangela/eslint-formatter-gha)

A better ESLint formatter specifically designed for GitHub Actions. Provides human-readable annotations and summaries with support for:

- Enhanced error reporting
- Configurable deprecated rule severity
- Rich GitHub Actions annotations
- Summary views in workflow runs

**Installation:**
```bash
npm install --save-dev @annangela/eslint-formatter-gha
```

**Usage:**
```bash
npx eslint -f @annangela/eslint-formatter-gha src
```

[View Package Documentation →](packages/eslint-formatter-gha/README.md)

### [@annangela/eslint-plugin-prefer-reflect](packages/eslint-plugin-prefer-reflect)

[![npm version](https://img.shields.io/npm/v/@annangela/eslint-plugin-prefer-reflect.svg)](https://www.npmjs.com/package/@annangela/eslint-plugin-prefer-reflect)

Modern version of the original `prefer-reflect` rules in ESLint. Encourages the use of Reflect API methods over traditional Object methods.

**Installation:**
```bash
npm install --save-dev @annangela/eslint-plugin-prefer-reflect
```

**Usage:**
```javascript
import preferReflectPlugin from "@annangela/eslint-plugin-prefer-reflect";

export default {
    plugins: {
        "@annangela/prefer-reflect": preferReflectPlugin,
    },
    rules: {
        "@annangela/prefer-reflect/prefer-reflect": "error",
    },
};
```

[View Package Documentation →](packages/eslint-plugin-prefer-reflect/README.md)

## 🚀 Quick Start

### Prerequisites

- Node.js: `^20.19 || ^22.21 || ^24.11`
- npm (comes with Node.js)

### Using the Packages

Each package can be installed independently based on your needs:

```bash
# For ESLint configuration
npm install --save-dev @annangela/eslint-config

# For GitHub Actions formatter
npm install --save-dev @annangela/eslint-formatter-gha

# For prefer-reflect plugin
npm install --save-dev @annangela/eslint-plugin-prefer-reflect
```

Refer to individual package documentation for detailed usage instructions.

## 🛠️ Development

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/AnnAngela/eslint-packages.git
   cd eslint-packages
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The postinstall script will automatically run to set up the workspace.

### Available Scripts

- **`npm run lint:check`** - Run ESLint on the entire monorepo
- **`npm run lint:write`** - Run ESLint with auto-fix
- **`npm run lint:check-ci`** - Run ESLint in CI mode with GitHub Actions formatter
- **`npm run test:eslint-plugin-prefer-reflect`** - Run tests for the prefer-reflect plugin
- **`npm run test:eslint-formatter-gha:lint`** - Run tests for the GHA formatter
- **`npm run package`** - Build all packages

### Package Development

Each package has its own build and test scripts:

```bash
# Build a specific package
cd packages/<package-name>
npm run package
```

### Running Tests

```bash
# Test prefer-reflect plugin
npm run test:eslint-plugin-prefer-reflect

# Test GHA formatter
npm run test:eslint-formatter-gha:lint
```

## 📚 Documentation

- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community guidelines and expectations
- **[Security Policy](SECURITY.md)** - Security vulnerability reporting and best practices

For package-specific documentation, please refer to the README files in each package directory.

## 🤝 Contributing

Contributions are welcome! This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint:check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the individual package directories for full license text.

## 🔗 Links

- **GitHub Repository**: [https://github.com/AnnAngela/eslint-packages](https://github.com/AnnAngela/eslint-packages)
- **Issue Tracker**: [https://github.com/AnnAngela/eslint-packages/issues](https://github.com/AnnAngela/eslint-packages/issues)
- **npm Organization**: [@annangela](https://www.npmjs.com/~annangela)

## 👤 Author

**AnnAngela**

- GitHub: [@AnnAngela](https://github.com/AnnAngela)

## ⭐ Support

If you find these packages helpful, please consider giving the repository a star on GitHub!

---

*Made with ❤️ for better ESLint configurations*
