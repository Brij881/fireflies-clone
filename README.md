# Fireflies.ai Clone

A full-stack meeting intelligence application inspired by Fireflies.ai.

The application allows users to manage meetings, review transcripts, search conversations, navigate transcript timestamps, manage action items, and review meeting summaries and topics.

## Features

### Meeting Library

- View all meetings
- Search by meeting title, summary, or participant
- Filter by participant
- Sort by most recent, oldest, or title
- Create new meetings
- Edit meeting metadata
- Delete meetings

### Meeting Intelligence

Each meeting contains:

- Meeting summary
- Participants
- Topics discussed
- Action items
- Speaker-attributed transcript
- Transcript timestamps

### Interactive Transcript

- Search within transcripts
- Highlight matching text
- Click transcript segments to seek playback
- Automatically highlight the active transcript segment
- Playback controls
- Playback speed control
- Timeline seeking

### Action Items

Users can:

- Add action items
- Edit action items
- Mark items complete/incomplete
- Delete action items

All changes are persisted in the database.

### Transcript Import

Meetings can be created by:

- Pasting transcript text
- Uploading `.txt` transcript files

Supported transcript formats include:

```text
Alex: Thanks everyone for joining.
Sarah: Let's review the launch timeline.
```

and timestamped transcripts:

```text
[00:00] Alex: Thanks everyone for joining.
[00:12] Sarah: Let's review the launch timeline.
```

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn

## Architecture

```text
┌─────────────────────────────┐
│        Next.js UI           │
│                             │
│ Dashboard / Meeting Detail  │
│ Transcript / Action Items   │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│          FastAPI            │
│                             │
│ Meetings                    │
│ Transcripts                 │
│ Topics                      │
│ Action Items                │
└──────────────┬──────────────┘
               │
               │ SQLAlchemy
               ▼
┌─────────────────────────────┐
│           SQLite            │
└─────────────────────────────┘
```

## Project Structure

```text
fireflies-clone/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── meetings/
│   │   │   └── meeting-detail/
│   │   └── lib/
│   └── package.json
│
└── README.md
```

## Running Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd fireflies-clone
```

### 2. Backend

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`:

```text
FRONTEND_URL=http://localhost:3000
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

The API runs at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```text
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Start Next.js:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## API

### Meetings

```text
GET     /api/meetings
GET     /api/meetings/{id}
POST    /api/meetings
PATCH   /api/meetings/{id}
DELETE  /api/meetings/{id}
```

### Transcript

```text
GET   /api/meetings/{id}/transcript
POST  /api/meetings/{id}/transcript
```

### Action Items

```text
GET     /api/meetings/{id}/action-items
POST    /api/meetings/{id}/action-items
PATCH   /api/action-items/{id}
DELETE  /api/action-items/{id}
```

### Topics

```text
GET /api/meetings/{id}/topics
```

## Data Model

The primary entities are:

- Meeting
- Participant
- TranscriptSegment
- ActionItem
- Topic

Relationships are persisted using SQLAlchemy and SQLite.

## Design Decisions

### Separate Frontend and Backend

Next.js and FastAPI are kept as independent applications. This provides a clear separation between presentation and business/data logic.

### Shared Playback State

The meeting workspace maintains a shared playback time between the simulated media player and transcript.

This allows:

```text
Transcript click → seek player
Player time → highlight transcript
```

### Transcript Representation

Transcripts are stored as individual segments rather than one large text field.

Each segment contains:

- Speaker
- Start time
- End time
- Text
- Segment order

This makes transcript searching, speaker attribution, and playback synchronisation straightforward.

### Persistence

SQLite was selected because the application is designed as a self-contained technical assignment and does not require external database infrastructure.

## Limitations

- The media player currently simulates playback rather than processing uploaded meeting audio/video.
- Transcript upload currently supports plain-text files.
- AI-generated summaries are represented by persisted meeting summary data rather than an external LLM service.
- Authentication and multi-user workspaces are outside the current scope.

## Future Improvements

Potential improvements include:

- Real audio/video upload and playback
- Automatic speech-to-text transcription
- AI-generated summaries
- Automatic action-item extraction
- Global transcript search
- Authentication
- Team workspaces
- Meeting sharing
- Export to PDF/Markdown
- Calendar integrations

## Production Build

Frontend:

```bash
cd frontend
npm run build
npm run start
```

Backend:

```bash
cd backend
uvicorn app.main:app
```