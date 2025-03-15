# Coding Challenge: String Character Search

## Challenge Description

Write a TypeScript function that checks if a given character exists within a specified range of indices in a string.

## Functional Requirements

* The function should accept three parameters:
    * `word`: A string to search within.
    * `character`: A single character to search for.
    * `range`: A tuple `[start, end]` representing the range of indices to search (inclusive).
* The function should return `true` if the character is found within the specified range, and `false` otherwise.
* Handle edge cases:
    * Empty input strings.
    * Invalid range values (e.g., `start` > `end`, out-of-bounds indices).

## Technical Requirements

* Use TypeScript. (Not originally in interview)
* No external libraries are allowed.
* Implement robust error handling.
* Write clean, readable, and well-documented code.

## Input/Output Specifications

* **Input:**
    * `word`: A string (e.g., "example").
    * `character`: A single character (e.g., "x").
    * `range`: A tuple of numbers (e.g., `[1, 3]`).
* **Output:**
    * A boolean value (`true` or `false`).

## Error Handling

* Throw an `Error` object with a descriptive message for invalid input.

## Testing

* Write unit tests using a testing framework of your choice (e.g., Jest, Mocha).
* Provide test cases for various scenarios, including edge cases.

## Submission Guidelines

* Create a GitHub repository for your solution.
* Include all source code and test files.
* Provide a `README.md` with instructions on how to run the code and tests.
* Submit the GitHub repository link.

## Evaluation Criteria

* Code correctness and functionality.
* Code quality and readability.
* Adherence to requirements.
* Test coverage.

## Examples

* `charSearch("example", "x", [1, 3])` should return `true`.
* `charSearch("example", "z", [1, 3])` should return `false`.
* `charSearch("example", "e", [0, 0])` should return `true`.
* `charSearch("example", "e", [5, 6])` should return `false`.