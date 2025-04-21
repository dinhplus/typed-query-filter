import { QueryBuilder, filterData } from '../../src';
import { customers } from '../examples/e-commerce-analytics';

// If customers data isn't available, let's import it from e-commerce-analytics or create it here
import { Customer } from '../examples/e-commerce-analytics';

export function runNestedObjectQueries() {
    console.log('\n----- Nested Object Queries Examples -----\n');

    // Example 1: Traditional way using $elemMatch
    console.time('Traditional query with $elemMatch:');
    const traditionalQuery = new QueryBuilder<Customer>()
        .where('orderHistory', {
            $elemMatch: {
                items: {
                    $elemMatch: {
                        'ratings.overall': { $gte: 4.5 }
                    }
                }
            }
        })
        .build();
    console.log('Query with $elemMatch:', traditionalQuery);

    const traditionalResults = new QueryBuilder<Customer>()
        .where('orderHistory', {
            $elemMatch: {
                items: {
                    $elemMatch: {
                        'ratings.overall': { $gte: 4.5 }
                    }
                }
            }
        })
        .filter(customers);
    console.timeEnd('Traditional query with $elemMatch:');
    console.log('Traditional results count:', traditionalResults.length);
    console.log('Customer IDs:', traditionalResults.map(c => c.id));

    // Example 2: New intuitive way without $elemMatch
    console.time('New intuitive query without $elemMatch:');
    const intuitiveQuery = new QueryBuilder<Customer>()
        .where('orderHistory', {
            items: {
                'ratings.overall': { $gte: 4.5 }
            }
        })
        .build();
    console.log('Intuitive query:', intuitiveQuery);

    const intuitiveResults = new QueryBuilder<Customer>()
        .where('orderHistory', {
            items: {
                'ratings.overall': { $gte: 4.5 }
            }
        })
        .filter(customers);
    console.timeEnd('New intuitive query without $elemMatch:');
    console.log('Intuitive results count:', intuitiveResults.length);
    console.log('Customer IDs:', intuitiveResults.map(c => c.id));

    // Example 3: Testing with alternative nested object syntax
    console.time('Alternative nested object syntax:');
    const alternativeQuery = new QueryBuilder<Customer>()
        .where('orderHistory', {
            items: {
                ratings: { overall: { $gte: 4.5 } }
            }
        })
        .build();
    console.log('Alternative query:', alternativeQuery);

    const alternativeResults = new QueryBuilder<Customer>()
        .where('orderHistory', {
            items: {
                ratings: { overall: { $gte: 4.5 } }
            }
        })
        .filter(customers);
    console.timeEnd('Alternative nested object syntax:');
    console.log('Alternative results count:', alternativeResults.length);
    console.log('Customer IDs:', alternativeResults.map(c => c.id));

    // Example 4: Check if all queries return the same results
    const areResultsEqual = compareResults(traditionalResults, intuitiveResults, alternativeResults);
    console.log('\nDo all query methods return the same results?', areResultsEqual ? 'Yes! ✅' : 'No! ❌');

    // Example 5: Complex case - multiple nested conditions
    console.time('Complex nested conditions:');
    const complexResults = new QueryBuilder<Customer>()
        .where('orderHistory', {
            items: {
                'ratings.overall': { $gte: 4.5 },
                category: { $some: ['electronics'] }
            },
            payment: {
                currency: 'USD'
            }
        })
        .filter(customers);
    console.timeEnd('Complex nested conditions:');
    console.log('Complex query results count:', complexResults.length);
    console.log('Customer IDs:', complexResults.map(c => c.id));
}

// Helper function to compare results
function compareResults(...resultSets: Customer[][]): boolean {
    if (resultSets.length < 2) return true;

    const firstSet = new Set(resultSets[0].map(c => c.id));

    for (let i = 1; i < resultSets.length; i++) {
        const currentSet = new Set(resultSets[i].map(c => c.id));

        // Check if sets have the same size
        if (firstSet.size !== currentSet.size) return false;

        // Check if all elements in first set exist in current set
        for (const id of firstSet) {
            if (!currentSet.has(id)) return false;
        }
    }

    return true;
}
