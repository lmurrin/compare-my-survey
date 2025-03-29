# Compare My Survey

Compare My Survey is a modern web application that helps users compare quotes from local property surveyors. Users can submit their postcode, choose the type of property survey they need, and instantly view quotes and contact surveyors offering services in their area.

## Features

- Compare survey quotes by postcode and property price
- Filter results by survey type (e.g., HomeBuyer, Building Survey, etc.)
- Support for UK postcode search, including robust postcode normalization
- Contact surveyors directly via email or phone
- Surveyor dashboard with profile, services, and editable location coverage
- Upload and display surveyor logos and company information
- Star rating visuals for each listing

## Preview

<a href="https://compare-my-survey-aa825.ondigitalocean.app/" target="_blank">
  <img src="https://compare-my-survey-aa825.ondigitalocean.app/" alt="View live example" />
</a>


---

## Tech Stack

- **Next.js 13+ / App Router**
- **Tailwind CSS** for styling
- **Sequelize** ORM with **MySQL**
- **NextAuth** for authentication
- **Headless UI** for modals and form elements
- **Heroicons** for clean SVG icons

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/compare-my-survey.git
cd compare-my-survey
```

2. **Add environment variables**

Create a .env file in the root using the env-sample.txt file.

3. **Create database**

Set up a MySQL database and ensure you add the credentials to the .env file.

Run "node createDatabase.js" in the terminal to create the database tables.

4. **Install Dependencies**

In the terminal run "npm i" to install the project dependencies.

5. **Start development environment**

In the terminal run "npm run dev" to start the development server.





