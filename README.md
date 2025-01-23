# README

## TODO

### Hotfixes

- [x] DS_Store to gitignore
- [ ] Markdown-it to parse GPT's md text output to HTML -> 25-1-20: this is causing errors

### Refactors

- [ ] Achieve parallellism through langchain parallel executions
- [ ] The logic for merging context and generating final output should be separated
- [ ] Streaming-like text output effect using WebSocket (current method : JS)

### Features

- [ ] Add memory logic(backend) and previous conversations nav bar(frontend) -> This would require a DB
- [ ] Social login feature -> DB required

## HOW TO

1. Initiate a Conda environment with python version>3.11
2. Install all dependencies specified in requirements.txt
3. Create a dotenv file in the /backend directory and add all API keys required for the build (in config.py)
4. Initialize a local frontend server in the /frontend directory : `python -m http.server 8080`
5. Initialize a local backend server in the /backend directory: `python app.py`
6. Access `http://localhost:8080/` via Google Chrome

## Commenting Conventions

- Python
  - _Requires_ docstring usage to describe functions `"""docstring_content"""`
  - _Rquires_ description of function invocations

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
