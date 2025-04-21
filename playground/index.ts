import { runBasicFiltering } from './examples/basic-filtering';
import { runAdvancedQueries } from './examples/advanced-queries';
import { runSortingLimitingExamples } from './examples/sorting-limiting';
import { runProjectionExamples } from './examples/projection';
import { playFilterData } from './examples/filterData';
import { runComplexQueries } from './examples/complex-queries';
import { runEcommerceAnalytics } from './examples/e-commerce-analytics';
import { runNestedObjectQueries } from './examples/nested-object-queries';

console.log('=== TYPED QUERY FILTER PLAYGROUND ===');

console.time('=== RUNNING EXAMPLES === completed in');
playFilterData();
runBasicFiltering();
runAdvancedQueries();
runSortingLimitingExamples();
runProjectionExamples();
runComplexQueries();
runEcommerceAnalytics();
runNestedObjectQueries(); // Added new nested object queries example
console.timeEnd('=== RUNNING EXAMPLES === completed in');
console.log('\n=== END OF PLAYGROUND ===');
