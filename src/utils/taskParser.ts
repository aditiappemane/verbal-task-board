
export interface ParsedTask {
  name: string;
  assignee: string;
  dueDate: string;
  dueTime: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
}

export const parseNaturalLanguageTask = (input: string): ParsedTask => {
  console.log('Parsing input:', input);
  
  // Initialize default values
  let name = '';
  let assignee = 'Unassigned';
  let dueDate = '';
  let dueTime = '';
  let priority: 'P1' | 'P2' | 'P3' | 'P4' = 'P3';

  // Clean the input
  const cleanInput = input.trim().toLowerCase();
  
  // Extract priority (P1, P2, P3, P4)
  const priorityMatch = input.match(/\b(p[1-4])\b/i);
  if (priorityMatch) {
    priority = priorityMatch[1].toUpperCase() as 'P1' | 'P2' | 'P3' | 'P4';
  }

  // Extract time patterns (more comprehensive)
  const timePatterns = [
    /\b(\d{1,2})\s*:\s*(\d{2})\s*(am|pm|AM|PM)\b/,
    /\b(\d{1,2})\s*(am|pm|AM|PM)\b/,
    /\b(\d{1,2})\s*:\s*(\d{2})\b/,
    /\bat\s+(\d{1,2})\s*(am|pm|AM|PM)\b/,
    /\bby\s+(\d{1,2})\s*(am|pm|AM|PM)\b/,
  ];

  for (const pattern of timePatterns) {
    const timeMatch = input.match(pattern);
    if (timeMatch) {
      if (timeMatch[3]) {
        // Format: 11pm or 11:30pm
        const hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] || '00';
        const period = timeMatch[3].toUpperCase();
        dueTime = `${hour}:${minute} ${period}`;
      } else if (timeMatch[2]) {
        // Format: 11pm (no minutes)
        const hour = parseInt(timeMatch[1]);
        const period = timeMatch[2].toUpperCase();
        dueTime = `${hour}:00 ${period}`;
      } else {
        // Format: 23:30 (24-hour)
        dueTime = `${timeMatch[1]}:${timeMatch[2] || '00'}`;
      }
      break;
    }
  }

  // Extract date patterns (more comprehensive)
  const datePatterns = [
    // Specific dates
    /\b(\d{1,2})(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i,
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(st|nd|rd|th)?\b/i,
    /\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/,
    /\b(\d{1,2})-(\d{1,2})-(\d{2,4})\b/,
    
    // Relative dates
    /\b(today|tomorrow|yesterday)\b/i,
    /\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month)\b/i,
    /\b(this|next)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\bin\s+(\d+)\s+(days?|weeks?|months?)\b/i,
  ];

  const today = new Date();
  let foundDate = false;

  for (const pattern of datePatterns) {
    const dateMatch = input.match(pattern);
    if (dateMatch) {
      foundDate = true;
      const match = dateMatch[0].toLowerCase();
      
      if (match.includes('today')) {
        dueDate = today.toISOString().split('T')[0];
      } else if (match.includes('tomorrow')) {
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dueDate = tomorrow.toISOString().split('T')[0];
      } else if (match.includes('yesterday')) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dueDate = yesterday.toISOString().split('T')[0];
      } else if (match.includes('next week')) {
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        dueDate = nextWeek.toISOString().split('T')[0];
      } else if (match.includes('next month')) {
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        dueDate = nextMonth.toISOString().split('T')[0];
      } else {
        // Try to parse the date
        try {
          const parsedDate = new Date(match);
          if (!isNaN(parsedDate.getTime())) {
            dueDate = parsedDate.toISOString().split('T')[0];
          }
        } catch (e) {
          // If parsing fails, set to today
          dueDate = today.toISOString().split('T')[0];
        }
      }
      break;
    }
  }

  // If no date found, default to today
  if (!foundDate) {
    dueDate = today.toISOString().split('T')[0];
  }

  // Extract assignee (names after common keywords)
  const assigneePatterns = [
    /\b(?:assign(?:ed)?\s+to|for|by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /\b([A-Z][a-z]+)\s+(?:should|needs to|will|must)/i,
    /\b(?:tell|ask|remind)\s+([A-Z][a-z]+)/i,
  ];

  // Also look for standalone names (capitalized words that aren't common words)
  const commonWords = ['call', 'finish', 'complete', 'send', 'email', 'meeting', 'task', 'project', 'report', 'by', 'at', 'on', 'in', 'the', 'and', 'or', 'but', 'for', 'with', 'from', 'to'];
  const words = input.split(/\s+/);
  
  for (const pattern of assigneePatterns) {
    const assigneeMatch = input.match(pattern);
    if (assigneeMatch && assigneeMatch[1]) {
      assignee = assigneeMatch[1];
      break;
    }
  }

  // If no assignee found through patterns, look for capitalized names
  if (assignee === 'Unassigned') {
    for (const word of words) {
      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
      if (cleanWord.length > 2 && 
          cleanWord[0] === cleanWord[0].toUpperCase() && 
          !commonWords.includes(cleanWord.toLowerCase()) &&
          !/\d/.test(cleanWord)) {
        assignee = cleanWord;
        break;
      }
    }
  }

  // Extract task name (everything before assignee/date/time keywords)
  let taskText = input;
  
  // Remove time, date, priority, and assignee information to get clean task name
  const removePatterns = [
    /\b(p[1-4])\b/gi,
    /\b(?:assign(?:ed)?\s+to|for|by)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/gi,
    /\b(?:today|tomorrow|yesterday)\b/gi,
    /\b(?:next|this)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month)\b/gi,
    /\b(?:at|by)\s+\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\b/gi,
    /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi,
    /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?\b/gi,
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
    /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g,
  ];

  for (const pattern of removePatterns) {
    taskText = taskText.replace(pattern, '');
  }

  // Also remove the assignee name if found
  if (assignee !== 'Unassigned') {
    taskText = taskText.replace(new RegExp(`\\b${assignee}\\b`, 'gi'), '');
  }

  // Clean up the task name
  name = taskText
    .replace(/\s+/g, ' ')
    .replace(/^\s*[-,.\s]+/, '')
    .replace(/[-,.\s]+\s*$/, '')
    .trim();

  // If name is too short or empty, use a default
  if (!name || name.length < 3) {
    name = 'New Task';
  }

  // Capitalize first letter
  name = name.charAt(0).toUpperCase() + name.slice(1);

  console.log('Parsed result:', { name, assignee, dueDate, dueTime, priority });

  return {
    name,
    assignee,
    dueDate,
    dueTime,
    priority,
  };
};
