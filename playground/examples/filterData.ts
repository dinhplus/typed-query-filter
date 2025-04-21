import { filterData } from '../../src'
import { users, User } from '../data/users';

export function playFilterData() {
    console.log('\n-----Filter Data Examples -----\n');

    console.time('Filter data');
    const data = filterData<User>(users,
        {
            age: {
                $not: {
                    $lt: 25,
                    $gt: 30
                    
                }
            },
            isActive: true,


        }
    );
    console.timeEnd('Filter data');
    console.log('Filter data:', data);
}
