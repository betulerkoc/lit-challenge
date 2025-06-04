# Employee Management Application

A web app built with LitElement to manage employee records.

## Features
- List, Add, Edit, and Delete employee records
- Pagination, search, responsive design
- Localization (EN/TR), routing, state management
- 85%+ test coverage

## Tech Stack
- LitElement (JavaScript)
- Vaadin Router
- Custom/Redux State Management
- Unit Testing (e.g., Karma, Mocha, Web Test Runner)

---

## ✅ Project Checklist

- [ ] **List all employee records**
  - [X] Display records in **list** and **table** formats
  - [ ] Include **pagination** and **search**
  - [X] Support **Edit** and **Delete** actions per record

- [X] **Add a new employee record**
  - [X] Fields:
         First Name
         Last Name
         Date of Employment
         Date of Birth
         Phone Number
         Email Address
         Department (Analytics, Tech)
         Position (Junior, Medior, Senior)
  - [X] Input validations
  - [X] Redirect to employee list page after successful addition

- [X] **Edit an existing employee record**
  - [X] Load record data into form fields
  - [X] Reuse the create/edit form component
  - [X] Validate and prompt before updating
  - [X] Redirect to employee list page after successful edit

- [X] **Delete an existing employee record**
  - [X] Prompt user for confirmation
  - [X] Update list view after deletion

---

### Additional Requirements

- [X] **Navigation Menu**

- [ ] **Routing**
  - [ ] Integrate routing (e.g., using **Vaadin Router**)

- [ ] **Responsive Design**
  - [ ] Desktop and mobile support

- [X] **State Management**
  - [X] Persist data in browser memory
  - [X] Use a custom solution or a 3rd-party library (e.g., Redux)

- [ ] **Localization**
  - [ ] Support **English** and **Turkish**

- [ ] **Testing**
  - [ ] Add unit tests for all components and logic
  - [ ] Ensure at least **85% test coverage**
