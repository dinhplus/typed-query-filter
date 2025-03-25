import { describe, it, expect } from 'vitest';
import { filterData } from '../filterData';
import { QueryBuilder } from '../QueryBuilder';

interface User {
    name: string;
    age: number;
    tags: string[];
}

const users: User[] = [
    { name: 'Alice', age: 25, tags: ['dev'] },
    { name: 'Bob', age: 17, tags: ['test'] },
    { name: 'Charlie', age: 30, tags: ['dev', 'blog'] },
];

describe('filterData', () => {
    it('should filter by age > 20', () => {
        const result = filterData(users, { age: { $gt: 20 } });
        expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie']);
    });

    it('should filter with $in operator', () => {
        const result = filterData(users, { name: { $in: ['Alice', 'Bob'] } });
        expect(result.length).toBe(2);
    });

    it('should filter with $all operator', () => {
        const result = filterData(users, { tags: { $all: ['dev', 'blog'] } });
        expect(result.map(u => u.name)).toEqual(['Charlie']);
    });

    it('should work with QueryBuilder chain', () => {
        const query = new QueryBuilder<User>()
            .where('age', { $gte: 25 })
            .where('tags', { $in: ['dev'] })
            .build();

        const result = filterData(users, query);
        expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie']);
    });
});
