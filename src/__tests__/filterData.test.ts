import { describe, it, expect } from 'vitest';
import { filterData } from '../filterData';
import { QueryBuilder } from '../QueryBuilder';

interface User {
  name: string;
  age: number;
  tags: string[];
  isActive: boolean;
  address: {
    city: string;
    country: string;
  };
  scores: number[];
  joinDate: Date;
  posts?: {
    id: number;
    title: string;
    likes: number;
    details: {
      tags: string[];
      published: boolean;
      comments: {
        user: string;
        text: string;
      }[];
    }
  }[];
}

const users: User[] = [
  {
    name: 'Alice',
    age: 25,
    tags: ['dev', 'typescript'],
    isActive: true,
    address: { city: 'New York', country: 'USA' },
    scores: [85, 92, 78],
    joinDate: new Date('2020-01-15'),
    posts: [
      {
        id: 1,
        title: 'TypeScript Tips',
        likes: 120,
        details: {
          tags: ['typescript', 'programming'],
          published: true,
          comments: [
            { user: 'Bob', text: 'Great article!' },
            { user: 'Charlie', text: 'Learned a lot, thanks!' }
          ]
        }
      },
      {
        id: 2,
        title: 'JavaScript vs TypeScript',
        likes: 85,
        details: {
          tags: ['javascript', 'typescript', 'comparison'],
          published: true,
          comments: [
            { user: 'David', text: 'Interesting comparison' }
          ]
        }
      }
    ]
  },
  {
    name: 'Bob',
    age: 17,
    tags: ['test', 'qa'],
    isActive: false,
    address: { city: 'Boston', country: 'USA' },
    scores: [70, 65, 72],
    joinDate: new Date('2021-03-20'),
    posts: [
      {
        id: 3,
        title: 'Testing 101',
        likes: 45,
        details: {
          tags: ['testing', 'qa'],
          published: true,
          comments: [
            { user: 'Alice', text: 'Basic but useful' }
          ]
        }
      }
    ]
  },
  {
    name: 'Charlie',
    age: 30,
    tags: ['dev', 'blog', 'cloud'],
    isActive: true,
    address: { city: 'San Francisco', country: 'USA' },
    scores: [95, 98, 90],
    joinDate: new Date('2019-11-05'),
    posts: [
      {
        id: 4,
        title: 'Cloud Deployment',
        likes: 200,
        details: {
          tags: ['aws', 'cloud', 'devops'],
          published: true,
          comments: [
            { user: 'David', text: 'Excellent guide!' },
            { user: 'Eve', text: 'Saved me hours of work' }
          ]
        }
      },
      {
        id: 5,
        title: 'Serverless Architecture',
        likes: 175,
        details: {
          tags: ['serverless', 'cloud', 'aws'],
          published: true,
          comments: [
            { user: 'Frank', text: 'Mind-blowing concepts' }
          ]
        }
      },
      {
        id: 6,
        title: 'Draft: Future of Programming',
        likes: 0,
        details: {
          tags: ['programming', 'future', 'ai'],
          published: false,
          comments: []
        }
      }
    ]
  },
  {
    name: 'David',
    age: 42,
    tags: ['manager', 'business'],
    isActive: true,
    address: { city: 'Chicago', country: 'USA' },
    scores: [80, 85, 82],
    joinDate: new Date('2018-07-22'),
    posts: []
  },
  {
    name: 'Eve',
    age: 22,
    tags: ['design', 'ui/ux'],
    isActive: true,
    address: { city: 'London', country: 'UK' },
    scores: [88, 91, 86],
    joinDate: new Date('2022-02-10'),
    
  }
];

describe('filterData - Basic Operators', () => {
  it('should filter by equality ($eq)', () => {
    const result = filterData(users, { name: { $eq: 'Alice' } });
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Alice');
    
    // Implicit $eq
    const implicitResult = filterData(users, { name: 'Alice' });
    expect(implicitResult).toEqual(result);
  });

  it('should filter by inequality ($ne)', () => {
    const result = filterData(users, { name: { $ne: 'Alice' } });
    expect(result.length).toBe(4);
    expect(result.map(u => u.name)).not.toContain('Alice');
  });

  it('should filter by greater than ($gt)', () => {
    const result = filterData(users, { age: { $gt: 20 } });
    expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie', 'David', 'Eve']);
  });

  it('should filter by greater than or equal ($gte)', () => {
    const result = filterData(users, { age: { $gte: 30 } });
    expect(result.map(u => u.name)).toEqual(['Charlie', 'David']);
  });

  it('should filter by less than ($lt)', () => {
    const result = filterData(users, { age: { $lt: 25 } });
    expect(result.map(u => u.name)).toEqual(['Bob', 'Eve']);
  });

  it('should filter by less than or equal ($lte)', () => {
    const result = filterData(users, { age: { $lte: 25 } });
    expect(result.map(u => u.name)).toEqual(['Alice', 'Bob', 'Eve']);
  });

  it('should filter by regex ($regex)', () => {
    const result = filterData(users, { name: { $regex: /^[AB]/ } });
    expect(result.map(u => u.name)).toEqual(['Alice', 'Bob']);
    
    // String regex
    const stringResult = filterData(users, { name: { $regex: '^[AB]' } });
    expect(stringResult).toEqual(result);
  });

  it('should filter by inclusion in array ($in)', () => {
    const result = filterData(users, { name: { $in: ['Alice', 'Bob', 'Unknown'] } });
    expect(result.map(u => u.name)).toEqual(['Alice', 'Bob']);
  });

  it('should filter by exclusion from array ($nin)', () => {
    const result = filterData(users, { name: { $nin: ['Alice', 'Bob'] } });
    expect(result.map(u => u.name)).toEqual(['Charlie', 'David', 'Eve']);
  });
});

describe('filterData - Array Operators', () => {
  it('should filter with $all operator', () => {
    const result = filterData(users, { tags: { $all: ['dev', 'blog'] } });
    expect(result.map(u => u.name)).toEqual(['Charlie']);
  });

  it('should filter with $some operator', () => {
    const result = filterData(users, { tags: { $some: ['dev'] } });
    expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie']);
  });
  
  it('should filter with $elemMatch operator', () => {
    const result = filterData(users, { 
      posts: { 
        $elemMatch: { 
          likes: { $gt: 100 },
          'details.published': true
        } 
      } 
    });
    expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie']);
  });

  it('should filter by array size ($size)', () => {
    const result = filterData(users, { posts: { $size: 0 } });
    expect(result.map(u => u.name)).toEqual(['David', 'Eve']);
    
    const result2 = filterData(users, { posts: { $size: 3 } });
    expect(result2.map(u => u.name)).toEqual(['Charlie']);
  });
});

describe('filterData - Logical Operators', () => {
  it('should combine conditions with $and', () => {
    const result = filterData(users, { 
      $and: [
        { age: { $gt: 20 } },
        { isActive: true },
        { 'address.country': 'USA' }
      ] 
    });
    expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie', 'David']);
  });

  it('should combine conditions with $or', () => {
    const result = filterData(users, { 
      $or: [
        { age: { $lt: 20 } },
        { 'address.country': 'UK' }
      ] 
    });
    expect(result.map(u => u.name)).toEqual(['Bob', 'Eve']);
  });

  it('should negate conditions with $not', () => {
    const result = filterData(users, { 
      isActive: { $not: true } 
    });
    expect(result.map(u => u.name)).toEqual(['Bob']);
  });

  it('should handle complex nested conditions', () => {
    const result = filterData(users, { 
      $and: [
        { age: { $gte: 20 } },
        { $or: [
          { tags: { $some: ['dev'] } },
          { 'address.country': 'UK' }
        ]}
      ] 
    });
    expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie', 'Eve']);
  });
});

describe('filterData - Nested Fields', () => {
  it('should access nested objects with dot notation', () => {
    const result = filterData(users, { 'address.city': 'New York' });
    expect(result.map(u => u.name)).toEqual(['Alice']);
  });

  it('should access deeply nested fields in arrays', () => {
    const result = filterData(users, { 
        
      'posts.details.tags': { $some: ['aws'] } 
    });
    expect(result.map(u => u.name)).toEqual(['Charlie']);
  });
});

describe('QueryBuilder - Basic Methods', () => {
  it('should build and execute simple queries', () => {
    const result = new QueryBuilder<User>()
      .where('age', { $gte: 30 })
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['Charlie', 'David']);
  });

  it('should chain multiple where conditions (implicit AND)', () => {
    const result = new QueryBuilder<User>()
      .where('isActive', true)
      .where('age', { $lt: 30 })
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['Alice', 'Eve']);
  });

  it('should handle OR conditions', () => {
    const result = new QueryBuilder<User>()
      .or([
        { age: { $lt: 20 } },
        { 'address.country': 'UK' }
      ])
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['Bob', 'Eve']);
  });

  it('should handle AND conditions', () => {
    const result = new QueryBuilder<User>()
      .and([
        { age: { $gt: 20 } },
        { isActive: true }
      ])
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie', 'David', 'Eve']);
  });

  it('should work with custom filter functions', () => {
    const result = new QueryBuilder<User>()
      .custom(user => user.name.startsWith('A') || user.name.startsWith('E'))
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['Alice', 'Eve']);
  });

  it('should handle complex nested queries', () => {
    const result = new QueryBuilder<User>()
      .where('isActive', true)
      .and([
        { age: { $gte: 20 } },
        { 
          $or: [
            { tags: { $some: ['dev'] } },
            { 'address.country': 'UK' }
          ]
        }
      ])
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie', 'Eve']);
  });
});

describe('QueryBuilder - Sorting and Limiting', () => {
  it('should sort results ascending', () => {
    const result = new QueryBuilder<User>()
      .sort('age', 'asc')
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['Bob', 'Eve', 'Alice', 'Charlie', 'David']);
  });

  it('should sort results descending', () => {
    const result = new QueryBuilder<User>()
      .sort('age', 'desc')
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['David', 'Charlie', 'Alice', 'Eve', 'Bob']);
  });

  it('should limit number of results', () => {
    const result = new QueryBuilder<User>()
      .sort('age', 'desc')
      .limit(2)
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['David', 'Charlie']);
  });

  it('should sort by nested field', () => {
    const result = new QueryBuilder<User>()
      .sort('address.city', 'asc')
      .filter(users);
    
    // Boston, Chicago, London, New York, San Francisco
    expect(result[0].name).toBe('Bob'); // Boston
    expect(result[4].name).toBe('Charlie'); // San Francisco
  });
});

describe('QueryBuilder - Select/Projection', () => {
  it('should select specific fields (Method 1)', () => {
    const result = new QueryBuilder<User>()
      .where('isActive', true)
      .select('name', 'age')
      .filter(users);
    
    expect(result.length).toBe(4);
    expect(Object.keys(result[0]).sort()).toEqual(['age', 'name']);
    expect(result[0].name).toBe('Alice');
    expect(result[0].age).toBe(25);
  });

  it('should select nested fields', () => {
    const result = new QueryBuilder<User>()
      .where('isActive', true)
      .select('name', 'address')
      .filter(users);
    
    expect(result.length).toBe(4);
    expect(Object.keys(result[0]).sort()).toEqual(['address', 'name']);
    expect(result[0].address.city).toBe('New York');
  });

  it('should transform results with callback function (Method 2)', () => {
    const result = new QueryBuilder<User>()
      .where('isActive', true)
      .select(user => ({
        fullName: user.name.toUpperCase(),
        yearsOld: user.age,
        location: `${user.address.city}, ${user.address.country}`,
        tagCount: user.tags.length
      }))
      .filter(users);
    
    expect(result.length).toBe(4);
    expect(Object.keys(result[0]).sort()).toEqual(['fullName', 'location', 'tagCount', 'yearsOld']);
    expect(result[0].fullName).toBe('ALICE');
    expect(result[0].location).toBe('New York, USA');
  });

  it('should reshape data with object template (Method 3)', () => {
    const result = new QueryBuilder<User>()
      .where('isActive', true)
      .select({
        fullName: 'name',
        years: 'age',
        city: 'address.city',
        activeStatus: true
      })
      .filter(users);
    
    expect(result.length).toBe(4);
    expect(Object.keys(result[0]).sort()).toEqual(['activeStatus', 'city', 'fullName', 'years']);
    expect(result[0].fullName).toBe('Alice');
    expect(result[0].activeStatus).toBe(true); // Static value
  });

  it('should work with array indexing in templates', () => {
    const result = new QueryBuilder<User>()
      .where('name', 'Alice')
      .select({
        name: 'name',
        firstPostTitle: 'posts[0].title',
        firstPostLikes: 'posts[0].likes'
      })
      .filter(users);
    
    expect(result.length).toBe(1);
    expect(result[0].firstPostTitle).toBe('TypeScript Tips');
    expect(result[0].firstPostLikes).toBe(120);
  });

  it('should transform arrays with template (array notation)', () => {
    const result = new QueryBuilder<User>()
      .where('name', 'Alice')
      .select({
        name: 'name',
        posts: ['posts', {
          title: 'title',
          popularity: 'likes',
          commentCount: 'details.comments.length',
          firstComment: 'details.comments[0].text'
        }]
      })
      .filter(users);
    
    expect(result.length).toBe(1);
    expect(result[0].posts.length).toBe(2);
    expect(result[0].posts[0].title).toBe('TypeScript Tips');
    expect(result[0].posts[0].popularity).toBe(120);
    expect(result[0].posts[0].commentCount).toBe(2);
    expect(result[0].posts[0].firstComment).toBe('Great article!');
  });

  it('should handle nested array transformations', () => {
    const result = new QueryBuilder<User>()
      .where('name', 'Alice')
      .select({
        name: 'name',
        posts: ['posts', {
          title: 'title',
          likes: 'likes',
          comments: ['details.comments', {
            author: 'user',
            message: 'text'
          }]
        }]
      })
      .filter(users);
    
    expect(result.length).toBe(1);
    expect(result[0].posts.length).toBe(2);
    expect(result[0].posts[0].comments.length).toBe(2);
    expect(result[0].posts[0].comments[0].author).toBe('Bob');
    expect(result[0].posts[0].comments[0].message).toBe('Great article!');
  });
});

describe('QueryBuilder - Combined Features', () => {
  it('should combine filtering, sorting, limiting and projection', () => {
    const result = new QueryBuilder<User>()
      .where('isActive', true)
      .where('age', { $gte: 20 })
      .sort('age', 'desc')
      .limit(2)
      .select('name', 'age', 'address.city')
      .filter(users);
    
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('David');
    expect(result[1].name).toBe('Charlie');
    expect(Object.keys(result[0]).sort()).toEqual(['address', 'age', 'name']);
  });

  it('should work with complex array transformations and filtering', () => {
    const result = new QueryBuilder<User>()
      .where('posts', { 
        $elemMatch: { 
          likes: { $gt: 100 },
          'details.published': true
        } 
      })
      .select({
        name: 'name',
        age: 'age',
        topPosts: ['posts', {
          title: 'title',
          popularity: 'likes',
          isPublished: 'details.published',
          tags: 'details.tags',
          commenters: ['details.comments', {
            user: 'user'
          }]
        }]
      })
      .filter(users);
    
    expect(result.map(u => u.name)).toEqual(['Alice', 'Charlie']);
    expect(result[0].topPosts[0].title).toBe('TypeScript Tips');
    expect(result[1].topPosts[0].popularity).toBe(200);
    expect(result[0].topPosts[0].commenters[0].user).toBe('Bob');
    expect(result[1].topPosts[0].tags).toContain('aws');
  });
});
