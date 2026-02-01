![IMG_7055](https://github.com/user-attachments/assets/33e223f9-de34-4883-b40c-2d8b41af8b04)
![IMG_7052](https://github.com/user-attachments/assets/271c9376-9f05-4c09-abf7-b58164c69fd2)
![IMG_4447](https://github.com/user-attachments/assets/fc2fbaa5-4738-4d3e-a4dc-0104791cd2e3)
# Nightwatch

Nightwatch keeps nighttime walkers safe by finding routes that maximize streetlight 
converage. Unlike some navigation services, our app uses streetlight density as a 
safety score to prevent people from walking into a dark alley.

## Setup instructions to run the app locally

**Frontend:**
1. create a virtual environment
   - if using MacOS, Linux, or WSL:
    ```bash
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    ```
   - if using windows powershell in administrator mode: 
   ```bash
    cd backend
    py -m venv .venv
    ..venv\Scripts\Activate.ps1
   ```

   if the activation is blocked on windows, run the following in powershell:
   ```bash
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. install the necessary python libraries highlighted in the requirements.txt file:
    ```bash    
    pip install -r requirements.txt
    ```

3. create your environment file by copying the example env file:
   - if using MacOS, Linux, or WSL:
    ```bash
    cp env.local.example .env.local
    ```
   - if using windows powershell in administrator mode:
    ```bash
    Copy-Item env.local.example .env.local
    ```

4. finally run the frontend locally:
    ```bash
    npm i && npm run dev
    ```

**Backend:**
1. create a virtual environment
   - if using MacOS, Linux, or WSL:
    ```bash
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    ```
   - if using windows powershell in administrator mode: 
   ```bash
    cd backend
    py -m venv .venv
    ..venv\Scripts\Activate.ps1
   ```

   if the activation is blocked on windows, run the following in powershell:
   ```bash
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
2. install the necessary python libraries highlighted in the requirements.txt file:
```bash    
pip install -r requirements.txt
```
1. create your environment file by copying the example env file:
   - if using MacOS, Linux, or WSL:
    ```bash
    cp env.example .env
    ```
   - if using windows powershell in administrator mode:
    ```bash
    Copy-Item env.example .env
    ```

    FYI:
     - `DEMO_MODE = 1` uses hardcoded mock data for generating paths. used for quick debugging.
     - `DEMO_MODE = 0` uses real routing calls fetched from the OpenStreetMap API

2. finally run the backend locally:
   - if using MacOS, Linux, or WSL:
    ```bash
    DEMO_MODE=0 uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
    ```
   - if using windows powershell in administrator mode:
    ```bash
    $env:DEMO_MODE="0"; uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
    ```

Finally, verify that the app is actually running by opening the following link 
in your browser

if a root route exists:
```
http://127.0.0.1:8000/ 
```

health endpoint:
```
http://127.0.0.1:8000/v1/health
```

swagger UI:
```
http://127.0.0.1:8000/docs
```

## General directory structure

- `frontend/` - Next.js app
- `backend/app/api/` - API routes
- `backend/app/services/` - Business logic
- `backend/app/data/` - Data layer
- `backend/scripts/` - Utility scripts
- `backend/app/services/routing_engine.py` - Routing algorithm
- `design/` - Design mockups
