# Test Fixtures

This directory contains sample HTML files and expected outputs for testing.

## Usage

Import fixtures in tests:

```typescript
import * as fs from 'fs';
import * as path from 'path';

const html = fs.readFileSync(
  path.join(__dirname, '../fixtures/sample-document.html'),
  'utf-8'
);
```
