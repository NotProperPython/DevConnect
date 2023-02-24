## DevConnect

A place for devs to express their thoughts

## How To Run

- Run `npm install` to install all of the dependencies
- Open a terminal in the root folder of the project and run `npm run dev`

### Prerequisites

Before running this application you will need to add a file named `default.json` with the JSON content below.

```json
{
  "mongoURI": "",
  "jwtSecret": "",
  "gitHubClientId": "",
  "gitHubSecret": ""
}
```

- **mongoURI**:

  - Go to `https://www.mongodb.com/atlas/database` and either signup or sign in
  - Create a new project.
  - Now you should have a DB infront you of with 3 options **_"Connect"_**, **_"View Monitoring"_** and **_"Browse Collection"_**.
  - Click -> **_"Connect"_** -> **_"Connect your application"_**
  - Copy and paste the URI for **mongoURI**

- **jwtSecret**:

  - This can any string which will be used to hash your user's passwords.

- For **gitHubClientId** and **gitHubSecret**
  - Assuming you are signed into Github. Go to Github developer setting: `https://github.com/settings/developers` and click on **_"New OAtuh App"_**
  - Fill the form with the following:
    | Field | Value |
    | --- | ----------- |
    | Application name | devconnector_dev |
    | Homepage URL | `http://localhost:5000` |
    | Authorization callback URL | `http://localhost:5000` |
  - After `Register Application` you will be able to see both tokens. Please add them to their appropriate places in `default.json`.
