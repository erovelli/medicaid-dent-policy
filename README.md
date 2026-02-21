# medicaid-dent-policy

## Application Setup Instructions

1. **Install Python**
	- Ensure you have Python 3 installed on your system. You can download it from [python.org](https://www.python.org/downloads/).

2. **Clone the Repository**
	- If you haven't already, clone this repository to your local machine:
	  ```sh
	  git clone https://github.com/erovelli/medicaid-dent-policy.git
	  ```

3. **Navigate to the Project Directory**
	- Open a terminal and change to the project directory:
	  ```sh
	  cd medicaid-dent-policy
	  ```

4. **Serve the Application**
	- Start a local web server using Python:
	  ```sh
	  python3 -m http.server 8000
	  ```
	- This will serve the app at [http://localhost:8000](http://localhost:8000).

5. **Open in Browser**
	- Open your web browser and go to [http://localhost:8000](http://localhost:8000) to view the application.

---

## Branching and Pull Request Workflow

1. **Create a New Feature Branch**
	- Use the following command to create and switch to a new branch:
	  ```sh
	  git checkout -b feature/<your-feature-name>
	  ```

2. **Push Your Branch to Remote**
	- Push the new branch to the remote repository:
	  ```sh
	  git push -u origin feature/<your-feature-name>
	  ```

3. **Open a Pull Request (PR)**
	- Go to your repository on GitHub.
	- You will see a prompt to create a pull request for your recently pushed branch.
	- Click "Compare & pull request".
	- Ensure the base branch is `main` and the compare branch is your `feature/<your-feature-name>` branch.
	- Fill in the PR details and submit.

---
This workflow allows you to propose changes from your feature branch to the main branch. Reviewers can comment and approve before merging.