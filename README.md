```markdown
# 🧠 typed-query-filter

> Type-safe, MongoDB-like query engine for JavaScript/TypeScript arrays — built for both frontend & backend.

---

## ✨ Features

- ✅ Type-safe query engine for object arrays
- ✅ MongoDB-like operators: `$eq`, `$gt`, `$in`, `$regex`, `$elemMatch`, `$and`, `$or`, `$where`, etc.
- ✅ `QueryBuilder<T>` chain API with `.where()`, `.and()`, `.or()`, `.custom()`
- ✅ `.sort()`, `.limit()`, `.select()` just like MongoDB
- ✅ Nested field access with autocomplete (`user.address.city`)
- ✅ Built-in type-safe helper: `FlatKey<T>`
- ✅ Optional WebAssembly backend for high-performance filtering (coming soon)
- ✅ Runs in both Node.js and modern browsers

---

## 📦 Install

```bash
npm install typed-query-filter
# or
yarn add typed-query-filter
```

---

## 🔧 Usage

### Example type:

```ts
interface User {
  name: string;
  age: number;
  hobbies: string[];
  posts: { title: string; likes: number }[];
}

const users: User[] = [
  { name: 'Alice', age: 25, hobbies: ['dev'], posts: [{ title: 'TS', likes: 10 }] },
  { name: 'Bob', age: 30, hobbies: ['test'], posts: [{ title: 'Rust', likes: 5 }] },
  { name: 'Charlie', age: 22, hobbies: ['dev', 'blog'], posts: [{ title: 'TS', likes: 50 }] },
];
```

---

### 👉 Basic Query

```ts
import { filterData } from 'typed-query-filter';

const result = filterData(users, {
  age: { $gte: 25 },
  hobbies: { $in: ['dev'] }
});
```

---

### 👉 With QueryBuilder

```ts
import { QueryBuilder } from 'typed-query-filter';

const qb = new QueryBuilder<User>()
  .where('age', { $gt: 20 })
  .where('posts', {
    $elemMatch: {
      likes: { $gte: 10 }
    }
  })
  .where('posts.title', { $regex: '^T' })
  .custom((doc) => doc.name.startsWith('C'))
  .sort('age', 'desc')
  .limit(1)
  .select('name', 'age');

const result = qb.filter(users);
```

---

## 🔎 Supported Operators

| Operator      | Description                        |
|---------------|------------------------------------|
| `$eq`, `$ne`  | Equality / inequality               |
| `$gt`, `$gte` | Greater than / or equal             |
| `$lt`, `$lte` | Less than / or equal                |
| `$in`, `$nin` | Value is (not) in array             |
| `$regex`      | Regex string match                  |
| `$exists`     | Field is defined or not             |
| `$not`        | Invert a condition                  |
| `$all`        | All values in array match           |
| `$size`       | Array has specific length           |
| `$elemMatch`  | Some element in array matches query |
| `$and`, `$or` | Combine multiple conditions         |
| `$where`      | Custom `(doc) => boolean` function  |

---

## 🔁 Advanced Usage

### 📚 `FlatKey<T>` helper for nested field paths

```ts
import { getFlatKeys } from 'typed-query-filter';

const fields = getFlatKeys<User>({
  name: '',
  age: 0,
  hobbies: [''],
  posts: [{ title: '', likes: 0 }]
});

// → ['name', 'age', 'hobbies', 'posts', 'posts.title', 'posts.likes']
```

> Useful for building dynamic filter UI with autocomplete

---

## 🧪 Testing

```bash
npm install
npm run test
```

Using [Vitest](https://vitest.dev/) for blazing-fast testing.

---

## 🚀 Coming Soon

- 🧩 WASM backend for ultra-fast filtering
- 🌐 Dynamic query parser (JSON-based)
- 🧱 Form builder integration (e.g., React filter builder)

---

## 📄 License

MIT © 2025 [DinhPlus](https://github.com/your-github)

---

## 🤝 Contributing

PRs and issues welcome! This project is designed to scale with many types of data structures and support massive filtering use cases (with WASM coming).

---
```
