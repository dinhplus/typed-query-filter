import { QueryBuilder } from '../../src';
import { users, User } from '../data/users';

export function runProjectionExamples() {
  console.log('\n----- Projection Examples -----\n');
  
  // Example 1: Select only name and email

  console.time('Users with only name and email:');
  const namesAndEmails = new QueryBuilder<User>()
    .select('name', 'email')
    .filter(users);
  console.timeEnd('Users with only name and email:');
  console.log(namesAndEmails);
  
  // Example 2: Select nested fields
  console.time('\nUsers with name and city:');
  const namesAndCities = new QueryBuilder<User>()
    .select('name', 'address.city')
    .filter(users);
  console.timeEnd('\nUsers with name and city:');
  console.log(namesAndCities);
  
  // Example 3: Combine with filtering
  console.time('\nActive users with only ID and name:');

  const activeUsersBasicInfo = new QueryBuilder<User>()
    .where('isActive', true)
    .select('id', 'name')
    .filter(users);
  console.timeEnd('\nActive users with only ID and name:');
  console.log(activeUsersBasicInfo);
}
