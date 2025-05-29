
# Natural Language Task Manager

An enterprise-grade task management application that allows users to create tasks using natural language input. Simply type or speak tasks like "Finish landing page by 20th June 11pm" and the app will intelligently parse the task name, assignee, due date, time, and priority.

## Features

- **Natural Language Processing**: Add tasks using conversational language
- **Voice Input**: Use speech-to-text for hands-free task creation
- **Smart Parsing**: Automatically extracts task details including:
  - Task name
  - Assignee
  - Due date and time
  - Priority level (P1-P4)
- **Dual View Modes**: Switch between card and table layouts
- **Inline Editing**: Edit any task field directly in the UI
- **Task Completion**: Mark tasks as complete with checkbox
- **Real-time Stats**: Track total tasks, high priority items, and completed tasks
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd natural-language-task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application running.

### Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Usage Examples

### Adding Tasks

The app understands natural language input. Here are some examples:

- `"Finish landing page by 20th June 11pm"` 
  - Task: "Finish landing page"
  - Due: June 20th at 11:00 PM
  - Priority: P3 (default)

- `"Call client Rajeev tomorrow 5pm P1"`
  - Task: "Call client"
  - Assignee: "Rajeev"
  - Due: Tomorrow at 5:00 PM
  - Priority: P1

- `"Complete report John by Friday 2pm P2"`
  - Task: "Complete report"
  - Assignee: "John"
  - Due: Friday at 2:00 PM
  - Priority: P2

### Voice Input

1. Click the microphone icon in the input field
2. Speak your task naturally
3. The app will convert speech to text and parse the task

### Editing Tasks

- Click on any field in the task cards or table to edit
- For priority, a dropdown will appear with P1-P4 options
- For dates, a date picker will be available
- Changes are saved automatically when you click away or press Enter

### Task Management

- **Mark Complete**: Use the checkbox to mark tasks as done
- **Delete Tasks**: Click the trash icon to remove tasks
- **View Modes**: Switch between card and table views using the tabs
- **Track Progress**: Monitor your progress with the stats dashboard

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── TaskManager.tsx     # Main task management component
│   ├── TaskCard.tsx        # Individual task card component
│   ├── TaskTable.tsx       # Table view component
│   ├── EditableField.tsx   # Inline editing component
│   └── VoiceInput.tsx      # Voice input component
├── utils/
│   └── taskParser.ts       # Natural language parsing logic
├── pages/
│   └── Index.tsx           # Main page component
└── hooks/
    └── use-toast.ts        # Toast notification hook
```

## Natural Language Parsing

The app uses sophisticated regex patterns and date parsing to understand:

- **Dates**: "tomorrow", "20th June", "next Friday", "June 20th"
- **Times**: "11pm", "2:30pm", "14:30", "5 o'clock"
- **Assignees**: Capitalized names that aren't common words
- **Priorities**: "P1", "P2", "P3", "P4" keywords
- **Task Names**: Everything else after removing parsed elements

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
