# typed-query-filter

> Type-safe MongoDB-like query filter engine for JavaScript & TypeScript.

## Install

```bash
npm install typed-query-filter
```

## Usage

```ts
import { QueryBuilder } from 'typed-query-filter';

type Product = { name: string; price: number }

const data = [ { name: 'iPhone', price: 999 }, ... ];

const result = new QueryBuilder<Product>()
  .where('price', { $gte: 500 })
  .limit(10)
  .filter(data);
```
