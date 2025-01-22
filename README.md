# README

## HOW TO

1. Initiate a Conda environment with a python version>3.11
2. Install all dependencies stipulated in requirements.txt
3. Create a dotenv file in the /backend directory and add all API keys required for the build (in config.py)
4. Initialize a local frontend server in the /frontend directory : `python -m http.server 8080`
5. Initialize a local backend server in the /backend directory: `python app.py`
6. Access `http://localhost:8080/` via Google Chrome

## Commenting Conventions

- Python
  - Use docstrings to describe functions `"""docstring_content"""`
  -

## Commit Message Conventions

```
Activity: Commit Message
```

- Activities:

  - `feat`: new features
  - `fix`: fix an error or issue
  - `chore` : not an operational code fix
  - `mod`: modify existing feature
  - `rfc`: refactor code
  - `rmv`: remove existing file or directory
  - `doc`: changes to document or comment
