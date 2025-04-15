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

## Code Structure Example

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