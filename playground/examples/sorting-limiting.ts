import { QueryBuilder } from '../../src';
import { users, User } from '../data/users';

export function runSortingLimitingExamples() {
  console.log('\n----- Sorting and Limiting Examples -----\n');
  
  // Example 1: Sort by age (ascending)
  console.time('Users sorted by age (ascending):');
  const sortedByAgeAsc = new QueryBuilder<User>()
    .sort('age', 'asc')
    .filter(users);
  console.timeEnd('Users sorted by age (ascending):');
  console.log(sortedByAgeAsc);
  
  // Example 2: Sort by age (descending)
  console.time('\nUsers sorted by age (descending):');
  const sortedByAgeDesc = new QueryBuilder<User>()
    .sort('age', 'desc')
    .filter(users);
  console.timeEnd('\nUsers sorted by age (descending):');
  console.log(sortedByAgeDesc);
  
  // Example 3: Limit results
  console.time('\nTop 3 oldest users:');
  const top3Oldest = new QueryBuilder<User>()
    .sort('age', 'desc')
    .limit(3)
    .filter(users);
  console.timeEnd('\nTop 3 oldest users:');
  console.log(top3Oldest);
  
  // Example 4: Combining everything
  console.time('\nActive users, sorted by join date, limited to 2:');
  const recentActive = new QueryBuilder<User>()
    .where('isActive', true)
    .sort('joinDate', 'desc')
    .limit(2)
    .filter(users);
  console.timeEnd('\nActive users, sorted by join date, limited to 2:');
  console.log(recentActive);
}
