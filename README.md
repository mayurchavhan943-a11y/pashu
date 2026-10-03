# PashuCare AI

AI-Powered Animal Disease Detection, Health Monitoring & Veterinary Assistance Platform.

**Current Phase Status:** Phase 2 (Database & Core Backend Implementation) - **Completed**

## Architecture & Technology Stack
PashuCare AI follows a microservices architecture:
- **Frontend**: React.js, React Router, Axios, Recharts, Vanilla CSS
- **Backend**: Java, Spring Boot, Spring Data JPA, Spring Security, Bean Validation, PostgreSQL
- **AI Service**: Python, FastAPI

## Folder Structure
- `frontend/`: Contains the React.js application.
- `backend/`: Contains the Spring Boot Java application.
- `ai-service/`: Contains the Python FastAPI AI service.

## Environment Variables
Create `.env` based on `.env.example`.
```env
DB_URL=jdbc:postgresql://localhost:5432/pashucare
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_32_bytes_long
AI_SERVICE_URL=http://localhost:8000
```

## Database Setup (PostgreSQL)
1. Ensure PostgreSQL is installed and running.
2. If `pashucare` database does not exist, you can create it using `pgAdmin` or `psql`.
   **SQL Command to create database:**
   ```sql
   CREATE DATABASE pashucare;
   ```
3. Update `backend/src/main/resources/application.properties` or environment variables with the correct DB credentials.
4. The Spring Boot backend uses `spring.jpa.hibernate.ddl-auto=update` and will automatically create/update tables without dropping existing data.

## Getting Started

### 1. Start the AI Service (FastAPI)
```bash
cd pashucare/ai-service
.\venv\Scripts\activate   # on Windows
uvicorn main:app --reload --port 8000
```
Verify at: `http://localhost:8000/health`

### 2. Start the Backend (Spring Boot)
Ensure you have Maven or use the wrapper (if it works on your OS).
```bash
cd pashucare/backend
mvn spring-boot:run
```
Verify at: `http://localhost:8081` (Port changed to 8081 to avoid conflicts)

### 3. Start the Frontend (React)
```bash
cd pashucare/frontend
npm run dev
```
Verify at: `http://localhost:5173`

## API Endpoints (Phase 2)

**Animals:**
- `GET /api/v1/animals`
- `GET /api/v1/animals/{id}`
- `POST /api/v1/animals`
- `PUT /api/v1/animals/{id}`
- `DELETE /api/v1/animals/{id}`

**Health Records:**
- `GET /api/v1/health-records/{id}`
- `POST /api/v1/health-records`

**Veterinarians:**
- `GET /api/v1/veterinarians`

**Diseases:**
- `GET /api/v1/diseases`

**Users:**
- `GET /api/v1/users/{id}`

### Sample API Requests

**Create an Animal (POST /api/v1/animals):**
```json
{
  "userId": 1,
  "animalType": "Cow",
  "breed": "Jersey",
  "nameOrTag": "Bessie-99",
  "age": 3,
  "gender": "Female",
  "weight": 500.5,
  "location": "Farm Area 2"
}
```

**Create a Health Record (POST /api/v1/health-records):**
```json
{
  "animalId": 1,
  "temperature": 102.5,
  "symptoms": "Lethargy, coughing",
  "behaviour": "Isolated from herd",
  "duration": "2 days",
  "appetite": "Low",
  "waterIntake": "Normal",
  "activityLevel": "Low",
  "additionalInformation": "Recently moved to a new pasture",
  "imageUrl": "http://example.com/cow-image.jpg"
}
```
