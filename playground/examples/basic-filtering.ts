import { QueryBuilder } from '../../src';
import { users, User } from '../data/users';

export function runBasicFiltering() {
  console.log('\n----- Basic Filtering Examples -----\n');
  
  // Example 1: Filter active users
  console.time('Active users query');
  const activeUsersQuery = new QueryBuilder<User>()
    .where('isActive', true)
    .build();

  console.log('Active users query:', activeUsersQuery);
  const activeUsers = new QueryBuilder<User>()
    .where('isActive', true)
    .filter(users);
  console.log('Results:', activeUsers);
  console.timeEnd('Active users query');

  // Example 2: Filter users by age
  console.time('Young users query');
  const youngUsersQuery = new QueryBuilder<User>()
    .where('age', { $lt: 30 })
    .build();
  
  console.log('\nYoung users query (age < 30):', youngUsersQuery);
  const youngUsers = new QueryBuilder<User>()
    .where('age', { $lt: 30 })
    .filter(users);
  console.timeEnd('Young users query');
  console.log('Results:', youngUsers);
  
  // Example 3: Filter users by tags
  console.time('Developer users query');
  const developerUsersQuery = new QueryBuilder<User>()
    .where('tags', { $in: ['developer'] })
    .build();
  
  console.log('\nDeveloper users query:', developerUsersQuery);
  const developers = new QueryBuilder<User>()
    .where('tags', { $in: ['developer'] })
    .filter(users);
  console.timeEnd('Developer users query');
  console.log('Results:', developers);
}
