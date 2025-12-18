# Cohort Builder Application

A full-stack application for querying patient cohorts using natural language. The system uses AI-powered query parsing to convert natural language queries into structured filters for medical data analysis.

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.2
- **AI/ML**: Google Generative AI (Gemini 3 Flash Preview)

### Frontend
- **Framework**: Angular 20.2
- **UI Library**: Angular Material 20.2
- **Language**: TypeScript 5.9

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Place your CSV data files in the `backend/data/` directory:
   - `patient.csv` - Patient cohort data
   - `sample.csv` - Sample data (optional)

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:4200`

## 🔌 API Endpoints

### `GET /health`
Health check endpoint that returns server status and dataset information.

**Response:**
```json
{
  "status": "OK",
  "datasetLoaded": true,
  "stats": { ... }
}
```

### `POST /api/query`
Main query endpoint that processes natural language queries.

**Request Body:**
```json
{
  "query": "female patients over 60"
}
```

**Response:**
```json
{
  "query": "female patients over 60",
  "filters": {
    "gender": { "operator": "=", "value": "female" },
    "age_at_diagnosis": { "operator": ">", "value": 60 }
  },
  "results": [...],
  "count": 42,
  "stats": {
    "count": 42,
    "age": { ... },
    "genderBreakdown": { ... }
  },
  "clarification_requests": [],
  "assumptions": [],
  "confidence": 0.95
}
```

### `POST /api/debug/parse`
Debug endpoint for testing query parsing without full query execution.

## 🧩 Key Implementation Details

### Natural Language Processing

The application uses Google's Gemini AI to parse natural language queries:

1. **Query Parsing** (`backend/utils/queryParser.js`):
   - Converts natural language to structured filters
   - Detects ambiguous terms (e.g., "elderly", "recent")
   - Returns clarification requests when needed
   - Provides confidence scores and assumptions

2. **Clarification System**:
   - When ambiguous terms are detected, the system returns clarification requests
   - Users can select from predefined options
   - Example: "elderly" → options for "age_at_diagnosis > 65" or "age_at_specimen_acquisition > 65"

### Data Processing

1. **CSV Loading** (`backend/utils/csvLoader.js`):
   - Loads and parses CSV files on server startup
   - Extracts column metadata and statistics
   - Provides column type information to the query parser

2. **Filtering** (`backend/utils/filterEngine.js`):
   - Supports multiple operators: `=`, `>`, `<`, `>=`, `<=`, `contains`, `in`
   - Handles missing/null values appropriately
   - Type-aware comparisons for numeric and string data

3. **Statistics** (`backend/utils/statsEngine.js`):
   - Computes aggregate statistics on filtered results
   - Age statistics (min, max, average) for diagnosis and specimen
   - Gender breakdown and other categorical distributions

### Frontend Architecture

1. **Data Normalization** (`frontend/src/app/utils/normalization.ts`):
   - Normalizes values for consistent filtering
   - Handles boolean fields (y/n, yes/no, true/false)
   - Categorical aliases (female/f/woman, male/m/man)
   - Ensures frontend filtering matches backend logic

2. **Client-Side Filtering**:
   - After initial query, filters can be adjusted client-side
   - Real-time statistics recalculation
   - Optimized for fast interactive filtering

## ✨ Features

- ✅ Natural language query processing
- ✅ AI-powered query parsing with Google Gemini
- ✅ Ambiguous term detection and clarification requests
- ✅ Real-time statistics computation
- ✅ Interactive filter management
- ✅ Client-side filtering with normalization
- ✅ Loading states and error handling
- ✅ Data table with sorting and pagination

## 🔧 Configuration

### Environment Variables (Backend)

- `PORT`: Server port (default: 3001)
- `GEMINI_API_KEY`: Google Gemini API key (required)

### Frontend Configuration

The API base URL is configured in `frontend/src/app/services/cohort.service.ts`:
```typescript
private baseUrl = 'http://localhost:3001/api';
```

## 🚧 Future Enhancements

Potential improvements:
- Database integration for larger datasets
- Query history and saved searches
- Export functionality (CSV, JSON)
- Advanced visualization charts
- Multi-dataset support
- User authentication and saved cohorts


