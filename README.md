# Application Setup (Docker)

These tests run against the RealWorld demo app running locally via Docker.

1. Clone the application repository:
   ```git clone https://github.com/NemTam/realworld-django-rest-framework-angular```

2. Start the application using Docker Compose:
   ```docker compose up -d --build```

3. Verify the app is running:
  ``` http://localhost:4200```


# Set up the Test Framework
Step 1: Clone this repository
```
git clone https://github.com/gabrielaciucanu-create/kraken-playwright-assignment
cd kraken-playwright-assignment
```

Step 2: Install dependencies
```npm install```

Step 3: Install Playwright browsers
```npx playwright install --with-deps```

# Configuration

All configuration is parameterized and stored in a YAML file.
```
config/config.yaml
baseUrl: http://localhost:4200

users:
  userA:
    username: testUser1
    email: testUser1@test.com
    password: test123
  userB:
    username: testUser2
    email: testUser2@test.com
    password: test123
```

## Notes
- baseUrl controls which environment the tests run against
- Usernames and emails are randomized at runtime to avoid conflicts


# Running the Tests
Run all tests (headless)
```npm test```

View the test report
```npm test:report```

# Test Coverage
### Core user journeys – all required
1. Sign-up & Login
- Register a new user
- Log in successfully
-  Attempt login with a wrong password → expect HTTP 401 / error message
2. Write Article
- Logged-in user creates an article (title, body, tags)
- Article appears in “My Articles” list
3. Follow Feed
- User A follows User B
- User B publishes a new article
- Article shows up in User A’s Your Feed

### Additional coverage
4. Edit / Delete Article
- Author can update body & tags, changes are visible
- Author can delete the article, it disappears from all lists
5. Comments
- Add a comment → it displays
- Delete the comment → it disappears


# Issues
- Attempt login with a wrong password 
    - Actual: Returns HTTP 422 / error message
    - Expected: HTTP 401 / error message