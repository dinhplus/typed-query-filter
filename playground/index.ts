import { runBasicFiltering } from './examples/basic-filtering';
import { runAdvancedQueries } from './examples/advanced-queries';
import { runSortingLimitingExamples } from './examples/sorting-limiting';
import { runProjectionExamples } from './examples/projection';

console.log('=== TYPED QUERY FILTER PLAYGROUND ===');

console.time('=== RUNNING EXAMPLES === completed in');
runBasicFiltering();
runAdvancedQueries();
runSortingLimitingExamples();
runProjectionExamples();
console.timeEnd('=== RUNNING EXAMPLES === completed in');
console.log('\n=== END OF PLAYGROUND ===');
