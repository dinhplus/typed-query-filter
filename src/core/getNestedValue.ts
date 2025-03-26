import { FlatKey } from './flatKey';


/**
 * Get value from an object using nested path
 * Supports dot notation, array notation, and wildcard array
 */
export function getNestedValue<T, K extends FlatKey<T>>(obj: T, path: K): any {
  if (!obj || !path) return undefined;
  
  // Parse path into segments
  const segments: string[] = [];
  let currentPart = '';
  let inBracket = false;
  
  // Process the path
  for (let i = 0; i < path.toString().length; i += 1) {
    const char = path.toString().charAt(i);
    
    if (char === '.' && !inBracket) {
      if (currentPart) segments.push(currentPart);
      currentPart = '';
    } else if (char === '[' && !inBracket) {
      if (currentPart) segments.push(currentPart);
      currentPart = '[';
      inBracket = true;
    } else if (char === ']' && inBracket) {
      currentPart += ']';
      segments.push(currentPart);
      currentPart = '';
      inBracket = false;
    } else {
      currentPart += char;
    }
  }
  
  if (currentPart) segments.push(currentPart);
  
  // Traverse through segments
  return segments.reduce((value, segment) => {
    if (value === null || value === undefined) return undefined;
    
    // Handle wildcard [*]
    if (segment === '[*]') {
      if (!Array.isArray(value)) return undefined;
      return value; // Return the entire array to be handled in the next step
    }
    
    // Handle array index [n]
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const indexStr = segment.substring(1, segment.length - 1);
      const index = parseInt(indexStr, 10);
      
      if (Array.isArray(value) && !isNaN(index)) {
        return value[index];
      }
      return undefined;
    }
    
    // Access regular property
    return value[segment];
  }, obj as any);
}
