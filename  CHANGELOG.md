# Changelog

All notable changes to the `typed-query-filter` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.6] - 2025-03-26

### Added
- Support for advanced array transformations in `select()` with nested templates
- Template-based array transformation using `['path', { template }]` syntax
- Support for array indexing in path expressions (e.g., `posts[0].title`)
- Enhanced sorting for nested properties (e.g., `sort('address.city', 'asc')`)

### Fixed
- Fixed `$size: 0` to correctly match both empty arrays and undefined/missing fields
- Improved path handling for nested array traversal (e.g., `posts.details.tags`)

## [1.0.5] - 2025-03-20

### Added
- Object template format for `select()` method
- Support for static values in projection templates

### Fixed
- Type inference for nested field paths

## [1.0.4] - 2025-03-15

### Added
- `$some` operator for array partial matching
- Callback function option for `select()` method
- Support for dot notation in query paths

## [1.0.3] - 2025-03-10

### Added
- `QueryBuilder` API with fluent interface
- Sorting functionality with `sort(field, direction)`
- Limiting with `limit(n)`
- Basic projection with `select('field1', 'field2')`

### Fixed
- Edge cases with null and undefined values

## [1.0.2] - 2025-03-05

### Added
- Array operators: `$elemMatch`, `$all`, `$size`
- Logical operators: `$and`, `$or`, `$not`
- Added support for custom filter functions

## [1.0.1] - 2025-03-01

### Added
- Basic operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`
- Array inclusion operators: `$in`, `$nin`
- String pattern matching with `$regex`

### Fixed
- Type definitions for nested objects

## [1.0.0] - 2025-02-25

### Added
- Initial release of `typed-query-filter`
- Core filtering functionality with type-safe queries
- TypeScript support with proper type inference
