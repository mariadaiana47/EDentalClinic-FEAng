# EDentalClinic

> A full-stack dental clinic management platform developed as my Bachelor's thesis project.

## Overview

EDentalClinic is a full-stack web application designed to digitize and streamline dental clinic workflows, from patient management and appointments to medical records and X-ray management.

The platform provides dedicated interfaces and role-based access for Doctors, Medical Assistants, Patients and Radiologists.

The project was developed as my Bachelor's thesis at Ovidius University of Constanța.

## Tech Stack

### Frontend

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

### Backend

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)

### Database & Tools

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Flyway](https://img.shields.io/badge/Flyway-CC0200?style=for-the-badge&logo=flyway&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

## Key Features

- Role-based access control for four user roles
- JWT-based authentication and authorization
- Patient medical records and treatment plans
- Appointment scheduling and management
- Dental chart management
- X-ray scheduling and examination workflow
- Radiologist dashboard and X-ray results
- Doctor and medical assistant dashboards
- Patient portal
- RESTful API integration
- Database versioning with Flyway
- Responsive user interface

## Application Roles

| Role | Main Responsibilities |
|------|------------------------|
| Doctor | Manage patients, medical records, treatments and appointments |
| Medical Assistant | Manage appointments and patient-related workflows |
| Patient | View appointments, medical information and treatment details |
| Radiologist | Manage X-ray examinations and examination results |

## Architecture

The application follows a layered full-stack architecture:

```text
┌─────────────────────────────┐
│       Angular Frontend      │
│     TypeScript + Bootstrap  │
└──────────────┬──────────────┘
               │ REST API
               ▼
┌─────────────────────────────┐
│       Spring Boot API       │
│ Spring Security + JWT       │
│      Business Logic         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│           MySQL             │
│      Flyway Migrations      │
└─────────────────────────────┘
