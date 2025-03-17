# Knowledge Base Guide

## Part 1: API Definition (`database/api`)

This part is the API definition of Sciux Components, Animations and Utilities.

### API Structure

The API is organized into several main categories:

1. **Components (`comp`)**: Define reusable UI components with:
   - Attributes (`attr`): Component properties
   - Events (`event`): Interactive events
   - Animations (`animation`): Component animations
   - Examples: Usage examples
   - Rules: Component rules
   - Usables: Component dependencies

2. **Animations (`anim`)**: Define reusable animations with:
   - Attributes: Animation properties
   - Usables: Compatible components

3. **Utilities (`util`)**: Helper functions with:
   - Parameters: Function parameters
   - Description: Usage description

### Usage

Components are defined using a fluent API:

```python
# Component Definition Example
comp("name", "description")
  .attr("property", "description", "type", "default")
  .event("eventName", "description", {"param": "type"})
  .animation("animName", "description")
  .example("code", "description")
  .rule("usage rule")
  .use("dependency1", "dependency2")
```

## Part 2: Knowledge Base (`database/database`)

The knowledge base contains categorized mathematical concepts and their visual representations using Sciux. Each category follows a structured format:

### Knowledge Category Structure

Each knowledge category (e.g., `radian`) contains:

1. `README.md`: Category description and usage examples
2. `knowledges.toml`: Knowledge definitions and metadata
3. `usage*.sciux`: Example implementations
4. `assets/`: Visual resources and diagrams

Each knowledge category should follow this structure to maintain consistency and clarity in the knowledge base.
