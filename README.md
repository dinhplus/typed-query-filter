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
- ✅ Flexible projection with 3 different `select()` methods
- ✅ Template-based array transformation
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
  posts: { 
    title: string; 
    likes: number;
    details: {
      tags: string[];
      comments: { user: string; text: string }[];
    }
  }[];
}

const users: User[] = [
  { name: 'Alice', age: 25, hobbies: ['dev'], posts: [{ title: 'TS', likes: 10, details: {tags: ['typescript'], comments: [{user: 'Bob', text: 'Great!'}]} }] },
  { name: 'Bob', age: 30, hobbies: ['test'], posts: [{ title: 'Rust', likes: 5, details: {tags: ['rust'], comments: [{user: 'Alice', text: 'Cool!'}]} }] },
  { name: 'Charlie', age: 22, hobbies: ['dev', 'blog'], posts: [{ title: 'TS', likes: 50, details: {tags: ['typescript', 'javascript'], comments: [{user: 'Dave', text: 'Nice!'}]} }] },
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
      likes: { $gte: 10 },
      'details.tags': { $some: ['javascript'] }
    }
  })
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
| `$some`       | match with some element in array    |

---

## 🔁 Projection with `select()`



### 1️⃣ Select specific fields
```ts
// Select just the fields you need
const result = new QueryBuilder<User>()
  .where('age', { $gt: 20 })
  .select('name', 'age', 'hobbies')
  .filter(users);

// Result:
// [
//   { name: 'Alice', age: 25, hobbies: ['dev'] },
//   { name: 'Bob', age: 30, hobbies: ['test'] },
//   { name: 'Charlie', age: 22, hobbies: ['dev', 'blog'] }
// ]
```

### 2️⃣ Transform with callback function
```ts
// Fully transform results with a callback function
const result = new QueryBuilder<User>()
  .where('age', { $gt: 20 })
  .select(user => ({
    fullName: user.name,
    ageInMonths: user.age * 12,
    primaryHobby: user.hobbies[0] || 'none',
    postCount: user.posts.length,
    mostLikedPost: user.posts.length > 0 
      ? user.posts.sort((a, b) => b.likes - a.likes)[0].title
      : null
  }))
  .filter(users);

// Result:
// [
//   { 
//     fullName: 'Alice', 
//     ageInMonths: 300, 
//     primaryHobby: 'dev',
//     postCount: 1,
//     mostLikedPost: 'TS'
//   },
//   // ...
// ]
```
### 3️⃣ Use template object
```ts
// Use an object template to reshape your data
const result = new QueryBuilder<User>()
  .where('age', { $gt: 20 })
  .select({
    fullName: 'name',
    years: 'age',
    skills: 'hobbies',
    isActive: true,  // Static value
    firstPost: 'posts[0].title'  // Array indexing
  })
  .filter(users);

// Result:
// [
//   { 
//     fullName: 'Alice', 
//     years: 25, 
//     skills: ['dev'],
//     isActive: true,
//     firstPost: 'TS'
//   },
//   // ...
// ]
```
#### ✨ Array Templates for Nested Transformations
For complex nested arrays, use the array template syntax:

```ts
const result = new QueryBuilder<User>()
  .where('age', { $gt: 20 })
  .select({
    name: 'name',
    age: 'age',
    // Transform the posts array
    posts: ['posts', {
      title: 'title',
      likeCount: 'likes',
      // Transform the nested comments array
      comments: ['details.comments', {
        author: 'user',
        message: 'text'
      }],
      tags: 'details.tags'
    }]
  })
  .filter(users);

// Result:
// [
//   { 
//     name: 'Alice',
//     age: 25,
//     posts: [
//       {
//         title: 'TS',
//         likeCount: 10,
//         comments: [
//           { author: 'Bob', message: 'Great!' }
//         ],
//         tags: ['typescript']
//       }
//     ]
//   },
//   // ...
// ]
```

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

MIT © 2025 [DinhPlus](https://github.com/dinhplus)

---

## 🤝 Contributing

PRs and issues welcome! This project is designed to scale with many types of data structures and support massive filtering use cases (with WASM coming).

---
```
