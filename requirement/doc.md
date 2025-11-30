Requirements Document: Educational Material Support Web Application
1. Introduction
1.1 Purpose
The purpose of this document is to define the functional and non-functional requirements for a web application designed to support educational material management, including teacher requests, school data management, and contributor participation.
1.2 Scope
The system enables:
Teachers to request materials.
Contributors to offer materials.
Admins to manage schools, teachers, materials, and contributors.
Users to search and filter schools.

2. System Overview
The web application provides a centralized platform where:
Teachers can register and submit requests for educational materials.
Contributors can register and specify which materials they can provide.
Schools can be registered and retrieved through search or district-based filtering.
Admins oversee and manage all data entities.

3. Functional Requirements
3.1 Teacher Management
FR-1: Add Teacher Information
The system shall provide an endpoint to add and store teacher details.
Input: Name, NIC/ID, contact details, school ID, subjects, role.
Output: Confirmation with teacher ID.

3.2 Material Request Management
FR-2: Submit Material Request
Teachers shall be able to submit material requests.
Input: Teacher ID, list of materials, quantity, description, urgency level.
Output: Confirmation with request ID.
FR-3: Edit Material Request
Teachers or admins shall be able to edit previously added material requests.
Input: Request ID, updated fields.
Output: Updated request confirmation.

3.3 School Management
FR-4: Add School
The system shall allow adding new schools.
Input: School name, district, address, contact details, type (e.g., primary, secondary).
Output: School ID and confirmation message.
FR-5: Search School by Name
Users shall be able to search for schools using partial or full school names.
Input: Search keyword.
Output: List of matching schools.
FR-6: Filter Schools by District
Users shall be able to list schools belonging to a specific district.
Input: District name.
Output: List of schools in that district.

3.4 Contributor Management
FR-7: Add Contributor Information
The system shall provide an endpoint to register contributors willing to provide materials.
Input: Name, contact details, address, organization (optional), contributor type (individual/organization).
Output: Contributor ID and confirmation.
FR-8: Add Contributor Material Types
Contributors shall be able to specify materials they wish to contribute.
Input: Contributor ID, material type(s), quantity capacity, notes.
Output: Confirmation with record ID.

4. Data Model Requirements
4.1 Entities
Teacher
Material Request
School
Contributor
Contributor Material
District (reference data)
Material Type (reference data)
4.2 Relationships
A school can have multiple teachers.
A teacher can have multiple material requests.
A contributor can offer multiple types of materials.

5. Non-Functional Requirements
5.1 Performance
Search operations must return results within 2 seconds.
The system must handle at least 200 concurrent users.
5.2 Security
All endpoints must require authentication except public school search.
Sensitive data must be encrypted in transit (HTTPS).
5.3 Usability
Interface should be simple enough for teachers with basic technical skills.
Mobile-friendly UI.
5.4 Scalability
The system should support future addition of new material categories and roles.

6. API Endpoint Summary
Feature
Method
Endpoint
Description
Add Teacher
POST
/teachers
Add teacher details
Request Material
POST
/materials/requests
Submit material request
Edit Material Request
PUT/PATCH
/materials/requests/{id}
Edit request
Add School
POST
/schools
Add new school
Search School
GET
/schools?name=xxx
Search school by name
Filter by District
GET
/schools?district=xxx
List schools by district
Add Contributor
POST
/contributors
Add contributor info
Contributor Material
POST
/contributors/{id}/materials
Add contribution material types


