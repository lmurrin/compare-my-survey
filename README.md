# Compare My Survey

Compare My Survey is a modern web application that helps users compare quotes from local property surveyors. Users can submit their postcode, choose the type of property survey they need, and instantly view quotes and contact surveyors offering services in their area.

## Features

- Compare survey quotes by postcode and property price
- Filter results by survey type (e.g., HomeBuyer, Building Survey, etc.)
- Support for all UK address with address autocomplete funcationality using IdealPostcodes API
- Location search achieved through geocoding address and matching polygon areas in database.
- Interactive area creation using Leaflet.js with polygon and circle drawing support
- Contact surveyors directly via email or phone
- Surveyor dashboard with profile, services, and editable location coverage
- Upload and display surveyor logos and company information
- Star rating visuals for each listing
- Stripe integration for balance top-ups

---

## Preview

### Homepage

![Homepage](https://compare-my-survey.s3.eu-north-1.amazonaws.com/public/home.png)

### Dashboard Overview

![Dashboard](https://compare-my-survey.s3.eu-north-1.amazonaws.com/public/dashboard.png)

### Leads Management

![Leads](https://compare-my-survey.s3.eu-north-1.amazonaws.com/public/leads.png)

### Define Coverage Areas

![Areas](https://compare-my-survey.s3.eu-north-1.amazonaws.com/public/areas.png)

### Billing Settings

![Billing](https://compare-my-survey.s3.eu-north-1.amazonaws.com/public/billing.png)

<a href="https://demo.comparemysurvey.com/" target="_blank">
  🚀 View Live Demo
</a>

---

## Tech Stack

- **Next.js 13+ (App Router)**
- **Tailwind CSS** for utility-first styling
- **Sequelize** ORM with **MySQL**
- **NextAuth.js** for secure authentication
- **Headless UI** for modals and form elements
- **Heroicons** for elegant SVG icons
- **Leaflet.js** for drawing polygon-based coverage areas
- **AWS S3** for file uploads (logos, images)
- **PostGIS** support for spatial queries

---

## Setup Instructions

### 1. Clone the Repository

Run:
git clone https://github.com/lmurrin/compare-my-survey.git
cd compare-my-survey

Run:
npm i

Add environment variables using env-example.txt

### 2. Set up Postgres DB

- Create a Postgres Database with the tables set out the /models folder.
- Install PostGIS extension to the database
