import { QueryBuilder } from '../../src';
import { users, User } from '../data/users';

export function runAdvancedQueries() {
  console.log('\n----- Advanced Query Examples -----\n');

  // // Example 1: Complex query with AND
  console.time('Complex query');
  const complexQuery = new QueryBuilder<User>()
    .and([
      { age: { $gt: 25 } },
      { isActive: true }
    ])
    .build();

  console.log('Complex query (age > 25 AND isActive):', complexQuery);
  const complexResults = new QueryBuilder<User>()
    .and([
      { age: { $gt: 25 } },
      { isActive: true }
    ])
    .filter(users);
  console.timeEnd('Complex query');
  console.log('Results:', complexResults);

  // // Example 2: Query with OR
  console.time('OR query');
  const orQuery = new QueryBuilder<User>()
    .or([
      { 'address.city': 'New York' },
      { 'address.city': 'San Francisco' }
    ])
    .build();

  console.log('\nOR query (city is NY or SF):', orQuery);
  const orResults = new QueryBuilder<User>()
    .or([
      { 'address.city': 'New York' },
      { 'address.city': 'San Francisco' }
    ])
    .filter(users);
  console.timeEnd('OR query');
  console.log('Results:', orResults);

  // // Example 3: Custom filter function
  console.time('Custom query');
  const customQuery = new QueryBuilder<User>()
    .custom(user => user.name.startsWith('J'))
    .build();

  console.log('\nCustom query (name starts with J):', customQuery);
  const customResults = new QueryBuilder<User>()
    .custom(user => user.name.startsWith('J'))
    .filter(users);
  console.timeEnd('Custom query');
  console.log('Results:', customResults);


  console.time('Advanced query');
  const qb = new QueryBuilder<User>()
    .where('age', { $gt: 20 })
    .where('posts', {
      $elemMatch: {
        likes: { $gte: 0 },
        'details.tags': { $some: ['javascript'] }
      }
    })
    .sort('age', 'desc')
    .limit(1)
    .select({
      fullName: 'name',
      contact: {
        email: 'email',
        location: 'address.city'
      },
      tags: 'tags',
      active: true,
      posts: ['posts', {
        postTitle: 'title',
        likesCount: 'likes',
        comments: ['comments', {
          user: 'user',
          text: 'text'
        }]
      }]
    })



  const result = qb.filter(users);
  console.timeEnd('Advanced query', );
  console.log('Advanced query result:', JSON.stringify(result));
}
