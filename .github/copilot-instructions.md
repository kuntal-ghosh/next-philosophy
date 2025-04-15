# GitHub Copilot Instructions

## Code Quality Guidelines

When generating code, please follow these principles:

1. **Clean Code**: Write readable, maintainable code following industry best practices.
2. **SOLID Principles**: Adhere to SOLID principles where applicable.
3. **DRY (Don't Repeat Yourself)**: Avoid code duplication.
4. **Consistent Formatting**: Follow the project's existing style conventions.

## Solution Structure

When providing solutions for feature development:

1. **Step-by-Step Approach**: Break down complex problems into logical, manageable steps.
2. **Clear Comments**: Each section of code should have explanatory comments that a CS graduate could understand.
3. **Defensive Programming**: Implement proper error handling, input validation, and edge case management.
4. **Contextual Reasoning**: Explain why certain approaches were chosen over alternatives when relevant.

## Documentation Requirements

For each solution, provide:

1. **Summary Section**: At the end of each solution, include a concise summary of the steps taken.
2. **Considerations**: Note any performance, security, or scalability considerations.
3. **Next Steps**: When appropriate, suggest potential improvements or extensions.

## TypeScript Best Practices

When writing TypeScript code, follow these guidelines:

1. **Explicit Typing**:
   - Always define explicit return types for functions and methods
   - Use interface or type aliases for complex object structures
   - Avoid using `any` type; prefer `unknown` when type is truly uncertain
   - Use generics to create reusable, type-safe components and functions

2. **Type Safety**:
   - Embrace strict null checking with proper null guards
   - Use union types instead of optional parameters when appropriate
   - Implement proper type narrowing with type guards and assertions
   - Leverage discriminated unions for state management

3. **Interface Design**:
   - Design interfaces around behavior rather than structure when possible
   - Use interface extension for inheritance relationships
   - Keep interfaces focused and cohesive (Interface Segregation Principle)
   - Consider readonly properties for immutable data

4. **Enums and Constants**:
   - Use const enums for values that won't change
   - Leverage string literal types for finite sets of string values
   - Create type-safe lookup objects with `as const` assertions
   - Document enum values with JSDoc comments

5. **Type Declarations**:
   - Create dedicated type declaration files (.d.ts) for external modules
   - Use module augmentation to extend existing types safely
   - Include JSDoc comments with examples for complex types
   - Design utility types for common transformations

```typescript
/**
 * Example: Properly typed component props
 */
// Define a robust interface for component props
interface DataTableProps<T extends Record<string, any>> {
  // Generic type parameter for table data
  data: T[];
  // Column configuration with strict typing
  columns: Array<{
    key: keyof T;
    header: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    sortable?: boolean;
  }>;
  // Function properties with explicit signatures
  onRowClick?: (item: T, index: number) => void;
  // Type-safe options with discriminated unions for different states
  loading?: {
    state: 'idle' | 'loading' | 'error' | 'success';
    error?: string;
  };
  // Strict typing for theme options
  theme?: 'light' | 'dark' | 'system';
}

// Implement with explicit return type
function DataTable<T extends Record<string, any>>({ 
  data,
  columns,
  onRowClick,
  loading = { state: 'idle' },
  theme = 'system'
}: DataTableProps<T>): React.ReactElement {
  // Type guard for handling loading states
  const isLoading = loading.state === 'loading';
  const hasError = loading.state === 'error';
  
  // Use type assertion for casting when necessary
  const sanitizedData = (data || []) as T[];
  
  // Rest of implementation...
  return (
    // Component implementation
  );
}

/**
 * Example: Type-safe utility function
 */
// Generic utility function with constraints and default
function createTypedCache<T extends object, K extends keyof T = keyof T>(
  initialData?: Record<string, T>,
  keyExtractor?: (item: T) => string
): {
  get(id: string): T | undefined;
  set(id: string, value: T): void;
  getAll(): Record<string, T>;
} {
  // Implementation with proper typing
  const cache: Record<string, T> = { ...initialData };
  
  return {
    get: (id: string): T | undefined => cache[id],
    set: (id: string, value: T): void => { cache[id] = value; },
    getAll: (): Record<string, T> => ({ ...cache })
  };
}
```

## React/Next.js Best Practices

When working with our Next.js application, follow these patterns:

1. **Container/Presentational Pattern**:
   - Separate data fetching (Container Components) from UI rendering (Presentational Components)
   - Container Components should be Server Components handling data fetching
   - Presentational Components can be Client or Shared Components focusing on UI

2. **Composition Pattern**:
   - Use composition to include Server Components inside Client Components
   - Pass Server Components as children to Client Components rather than importing them directly
   - Design components with props that accept React children when they need to render dynamic content

3. **Container 1st Design**:
   - Start by mapping out Container Components and their data requirements
   - Implement Container Components with proper data fetching before UI components
   - Use parallel data fetching with Promise.all() when appropriate
   - Follow with Presentational Components once data structure is established

4. **State Management**:
   - Prefer URL-based state for shareable content like search terms
   - Use local state (useState) for UI-only concerns
   - Implement Server Actions for form submissions and data mutations
   - Choose uncontrolled components with defaultValue for form inputs when appropriate

5. **Error Handling and Loading States**:
   - Implement proper error boundaries
   - Create dedicated loading states using loading.tsx files
   - Validate data before rendering to prevent runtime errors
   - Provide fallback UI for empty or error states

## Component Structure Example

```tsx
/**
 * Feature: [Feature Name]
 * Description: Brief description of what this component does
 */

// For Client Components only
"use client"; // Only add when component requires client-side interactivity

import { useState } from "react";
import { useFormState } from "react-dom"; // For Server Actions
import { someServerAction } from "@lib/actions"; // Server Actions can be imported

// Step 1: Set up state and props
export default function ExampleComponent({ initialData, children }) {
  // Defensive programming: Ensure data is valid and provide defaults
  const validData = Array.isArray(initialData) ? initialData : [];
  
  // Local state for UI concerns only
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Step 2: Handle user interactions
  const handleToggle = () => {
    setIsExpanded(prev => !prev);
  };
  
  // Step 3: Render UI with proper composition
  return (
    <div className="example-component">
      {/* UI for interaction */}
      <button onClick={handleToggle}>
        {isExpanded ? "Collapse" : "Expand"}
      </button>
      
      {/* Conditional rendering */}
      {isExpanded && (
        <div className="expanded-content">
          {/* Map data with proper key and error handling */}
          {validData.map(item => (
            <div key={item.id} className="item">
              {item.name}
            </div>
          ))}
          
          {/* Render children (potentially Server Components) */}
          {children}
        </div>
      )}
      
      {/* Fallback for empty state */}
      {validData.length === 0 && (
        <p className="empty-state">No data available</p>
      )}
    </div>
  );
}

/**
 * Summary:
 * 1. Created a responsive component that toggles content visibility
 * 2. Implemented data validation to prevent rendering errors
 * 3. Used composition pattern to allow rendering of Server Components
 * 4. Added fallback UI for empty data state
 * 
 * Performance considerations:
 * - Used conditional rendering to avoid unnecessary DOM elements
 * - Applied proper React patterns to minimize re-renders
 * 
 * Accessibility considerations:
 * - Used semantic HTML elements
 * - Ensured interactive elements are keyboard accessible
 */
```

## Code Structure Example (Original)

```typescript
/**
 * Feature: [Feature Name]
 * Description: Brief description of what this code does
 */

// Step 1: Initialize required variables and validate inputs
// This section handles parameter validation and setup
function exampleFunction(param1, param2) {
  // Defensive programming: Input validation
  if (!param1) throw new Error('param1 is required');
  
  // Setup initial state
  const result = [];
  
  // Step 2: Process the core logic
  // This demonstrates the main algorithm for the feature
  const processedData = param1.map(item => {
    // Transform each item with explanation of the transformation
    return transform(item);
  });
  
  // Step 3: Handle edge cases
  // Special handling for boundary conditions
  if (specialCondition) {
    // Logic for handling special case with explanation
  }
  
  // Step 4: Return results
  return {
    data: processedData,
    metadata: { processed: true }
  };
}

/**
 * Summary:
 * 1. Validated input parameters to ensure required data was provided
 * 2. Processed each item using the transform function
 * 3. Handled special conditions for edge cases
 * 4. Returned structured response with both data and metadata
 */
```