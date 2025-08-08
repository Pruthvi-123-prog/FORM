<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a full-stack form builder application with the following architecture:

## Tech Stack:
- **Frontend**: React.js with TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js with Express.js, MongoDB with Mongoose
- **Key Libraries**: react-beautiful-dnd for drag-and-drop, axios for API calls, lucide-react for icons

## Project Structure:
- `/client` - React frontend application
- `/server` - Express.js backend API
- `/server/models` - Mongoose schemas for Form and Response
- `/server/routes` - API route handlers
- `/client/src/components` - React components
- `/client/src/pages` - Page components
- `/client/src/types` - TypeScript type definitions
- `/client/src/utils` - Helper functions and API client

## Key Features:
1. **Form Builder**: Create forms with custom question types
2. **Question Types**: Categorize (drag-and-drop), Cloze (fill-in-the-blanks), Comprehension (passage with questions)
3. **Form Management**: Create, edit, delete, publish/unpublish forms
4. **Response Collection**: Submit responses and view analytics
5. **Image Support**: Header images and question images

## API Endpoints:
- `GET/POST /api/forms` - Form CRUD operations
- `GET/POST /api/responses` - Response handling
- `POST /api/upload/image` - Image uploads

## Database Schema:
- **Form**: Contains form metadata, settings, and questions array
- **Response**: Contains submitted answers and analytics data

When working on this codebase:
- Follow TypeScript best practices
- Use Tailwind CSS classes for styling
- Maintain consistent error handling with toast notifications
- Keep components modular and reusable
- Use proper MongoDB schema validation
