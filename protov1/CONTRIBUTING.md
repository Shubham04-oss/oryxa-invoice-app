# Contributing to Oryxa

First off, thank you for considering contributing to Oryxa! 🎉

Oryxa is an open-source invoice and automation platform built for modern businesses. We welcome contributions from developers of all experience levels.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)

---

## 📜 Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). By participating, you are expected to uphold this code.

**TL;DR**: Be respectful, inclusive, and professional.

---

## 🤝 How Can I Contribute?

### Reporting Bugs
- Check [existing issues](https://github.com/your-username/oryxa/issues) first
- Use the bug report template
- Include steps to reproduce, expected vs actual behavior
- Add screenshots/logs if applicable

### Suggesting Features
- Check [existing feature requests](https://github.com/your-username/oryxa/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
- Use the feature request template
- Explain the problem and proposed solution
- Consider implementation complexity and maintenance burden

### Contributing Code
- Fix bugs (check [good first issues](https://github.com/your-username/oryxa/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22))
- Implement features (check [help wanted](https://github.com/your-username/oryxa/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22))
- Improve documentation
- Write tests

### Improving Documentation
- Fix typos, broken links
- Add examples, clarify instructions
- Translate documentation
- Create tutorials, videos

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Git
- Docker Desktop (optional)

### Setup Steps
```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/oryxa.git
cd oryxa

# 3. Add upstream remote
git remote add upstream https://github.com/original-owner/oryxa.git

# 4. Install dependencies
npm install

# 5. Copy environment variables
cp .env.example .env

# 6. Start local database
docker-compose up -d

# 7. Run migrations
npx prisma migrate dev

# 8. Seed sample data
node scripts/seed.js

# 9. Start development servers
npm run dev
```

### Verify Setup
```bash
# API should respond
curl http://localhost:3000/api/health

# Database should be accessible
npm run db:studio
```

---

## 📝 Coding Guidelines

### General Principles
- **Keep it simple**: Avoid over-engineering
- **Write readable code**: Code is read more than written
- **Test your changes**: Add tests for new features/fixes
- **Document complex logic**: Add comments for non-obvious code

### JavaScript/TypeScript
- Use **ES6+ syntax** (const/let, arrow functions, async/await)
- **Destructure** objects/arrays for cleaner code
- **Avoid var**: Use const by default, let when reassignment needed
- **Use TypeScript** for new files when possible
- **Handle errors**: Use try/catch, don't swallow errors

### File Organization
```
modules/
  ├── invoices/
  │   ├── service.js      # Business logic
  │   ├── validation.js   # Input validation schemas
  │   ├── utils.js        # Utility functions
  │   └── types.js        # TypeScript types
```

### Naming Conventions
- **Files**: kebab-case (`invoice-service.js`)
- **Functions**: camelCase (`calculateTotal()`)
- **Classes**: PascalCase (`InvoiceGenerator`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Private functions**: prefix with `_` (`_helperFunction()`)

### Code Style
We use ESLint + Prettier. Run before committing:
```bash
npm run lint:fix
```

**Example:**
```javascript
// ❌ Bad
function create_invoice(data){
  const total=data.items.reduce((sum,item)=>sum+item.price,0)
  return {total:total}
}

// ✅ Good
function createInvoice(data) {
  const total = data.items.reduce((sum, item) => sum + item.price, 0);
  return { total };
}
```

---

## 📨 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring (no feature change)
- **test**: Adding/updating tests
- **chore**: Maintenance tasks (deps, build, etc.)
- **perf**: Performance improvements

### Examples
```bash
# Feature
git commit -m "feat(invoices): add bulk send functionality"

# Bug fix
git commit -m "fix(pdf): resolve alignment issue in invoice template"

# Documentation
git commit -m "docs(readme): add deployment section"

# Breaking change
git commit -m "feat(auth)!: migrate to JWT v2

BREAKING CHANGE: Old JWT tokens are no longer valid"
```

---

## 🔄 Pull Request Process

### Before Submitting
1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make changes**
   - Write code
   - Add tests
   - Update documentation

4. **Run checks**
   ```bash
   npm run lint
   npm test
   npm run type-check
   ```

5. **Commit with conventional commits**
   ```bash
   git add .
   git commit -m "feat(invoices): add recurring invoices"
   ```

6. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

### Submitting PR
1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill in the PR template:
   - **Title**: Clear, descriptive (e.g., "Add recurring invoice feature")
   - **Description**: What changed and why
   - **Related Issues**: Link to issue numbers (#123)
   - **Screenshots**: For UI changes
   - **Testing**: How you tested

### PR Review Process
1. Maintainer reviews within 48 hours
2. Address feedback with new commits
3. Once approved, maintainer merges
4. Celebrate! 🎉

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Self-review performed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No new warnings
- [ ] Conventional commit messages

---

## 🧪 Testing Guidelines

### Test Structure
```javascript
// Example test
describe('Invoice Service', () => {
  describe('createInvoice', () => {
    it('should create invoice with correct total', async () => {
      const data = {
        items: [
          { description: 'Item 1', quantity: 2, unitPrice: 100, taxRate: 10 }
        ]
      };
      
      const invoice = await createInvoice(data);
      
      expect(invoice.total).toBe(220); // (2 * 100) + 10% tax
    });

    it('should throw error for invalid data', async () => {
      await expect(createInvoice({})).rejects.toThrow('Items required');
    });
  });
});
```

### Running Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Writing Good Tests
- **Test behavior, not implementation**
- **One assertion per test** (mostly)
- **Use descriptive test names**
- **Clean up after tests** (reset database, etc.)
- **Mock external services** (don't hit real APIs)

---

## 📚 Documentation Guidelines

### README Updates
- Update README.md for feature changes
- Keep setup instructions current
- Add examples for new features

### Code Comments
```javascript
// ❌ Bad: Obvious comment
// Set x to 5
const x = 5;

// ✅ Good: Explains "why"
// Use 5-second delay to avoid rate limiting
const DELAY_MS = 5000;
```

### API Documentation
Update `API_EXAMPLES.http` with new endpoints:
```http
### Create Recurring Invoice
POST {{baseUrl}}/api/invoices/recurring
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "frequency": "monthly",
  "startDate": "2025-11-01"
}
```

---

## 🎯 Priority Areas

We're especially looking for help with:
1. **Testing**: Increase test coverage
2. **Documentation**: Tutorials, videos, translations
3. **Accessibility**: A11y improvements
4. **Performance**: Optimization opportunities
5. **Security**: Vulnerability reports

---

## 🏆 Recognition

Contributors are recognized in:
- GitHub contributors list
- CHANGELOG.md (for significant contributions)
- README.md (for major features)

---

## ❓ Questions?

- **GitHub Discussions**: [discussions](https://github.com/your-username/oryxa/discussions)
- **Discord**: [discord.gg/oryxa](https://discord.gg/oryxa)
- **Email**: contributors@oryxa.com

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Oryxa!** Every contribution, no matter how small, makes a difference. 💙
