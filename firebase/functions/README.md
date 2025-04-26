# Firebase Functions

## Directory Structure
```
/functions
  ├── sources/        # Source-specific implementations
  │    ├── goodreads/    # Goodreads source
  │    │    ├── data.js        # Data fetching and transformation
  │    │    ├── handlers.js    # Business logic and Firebase functions
  │    │    ├── types.js       # Type definitions
  │    │    ├── constants.js   # Source-specific constants
  │    │    └── __tests__/     # Source-specific tests
  │    └── [future-sources]/   # Other sources (e.g., IMDB, BoardGameGeek)
  │
  ├── shared/         # Shared code across sources
  │    ├── types/       # Common type definitions
  │    ├── utils/       # Shared utilities
  │    └── constants/   # Shared constants
  │
  ├── __tests__/     # Global test files
  │    ├── integration/  # Tests requiring Firebase emulator
  │    ├── mocks/       # Mock data and helper functions
  │    └── unit/        # Pure function tests
  │
  ├── index.js       # Function exports and trigger definitions
  └── README.md      # This file
```

## Directory Purposes

### `/sources`
Each source (e.g., Goodreads, IMDB) has its own directory containing:
- `data.js`: Data access layer for external APIs
- `handlers.js`: Business logic and Firebase function implementations
- `types.js`: Type definitions specific to the source
- `constants.js`: Source-specific constants
- `__tests__/`: Tests specific to this source

### `/shared`
Code shared across multiple sources:
- `/types`: Common type definitions
- `/utils`: Shared utility functions
- `/constants`: Shared configuration and constants

### `/__tests__`
Global test files:
- `/integration`: Tests requiring Firebase emulator
  - End-to-end function testing
  - Firestore interaction testing
- `/mocks`: Shared mock data and utilities
  - Mock responses
  - Test data factories
- `/unit`: Pure function tests
  - No Firebase dependencies
  - Utility function testing

### `index.js`
- Exports all Cloud Functions
- Defines function triggers and configurations
- Routes requests to appropriate source handlers

## Adding a New Source

To add a new source:

1. Create a new directory under `/sources/[source-name]/`
2. Implement required files:
   - `data.js`: Data fetching and transformation
   - `handlers.js`: Business logic
   - `types.js`: Type definitions
   - `constants.js`: Source-specific constants
3. Add source-specific tests in `__tests__/`
4. Update `index.js` to handle the new source

## Testing

Each source should have comprehensive tests:

1. Unit Tests:
   - Test data transformation
   - Test utility functions
   - No external dependencies

2. Integration Tests:
   - Test full function execution
   - Use Firebase emulator
   - Mock external APIs

## Best Practices

1. Keep source-specific code isolated in its directory
2. Share common utilities through `/shared`
3. Maintain consistent structure across sources
4. Document source-specific requirements
5. Write comprehensive tests
