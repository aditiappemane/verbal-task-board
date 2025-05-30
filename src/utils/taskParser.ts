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

  // Extract time patterns (improved for better matching)
  const timePatterns = [
    /\b(\d{1,2})\s*:\s*(\d{2})\s*(a\.?m\.?|p\.?m\.?)\b/i,
    /\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/i,  // This pattern should match both "5pm" and "5:30pm"
    /\b(\d{1,2})\s*:\s*(\d{2})\b/,
    /\bat\s+(\d{1,2})\s*:\s*(\d{2})\s*(a\.?m\.?|p\.?m\.?)\b/i,
    /\bby\s+(\d{1,2})\s*:\s*(\d{2})\s*(a\.?m\.?|p\.?m\.?)\b/i,
    /\bat\s+(\d{1,2})\s*(a\.?m\.?|p\.?m\.?)\b/i,
    /\bby\s+(\d{1,2})\s*(a\.?m\.?|p\.?m\.?)\b/i,
  ];

  console.log('Input text:', input);
  console.log('Looking for time patterns...');

  for (const pattern of timePatterns) {
    const timeMatch = input.match(pattern);
    if (timeMatch) {
      console.log('Found time match:', timeMatch);
      console.log('Match groups:', timeMatch.slice(1));
      
      if (timeMatch[3]) {
        // Format: 11pm or 11:30pm
        let hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2] || '00';
        const periodRaw = timeMatch[3].toLowerCase().replace(/\./g, '');
        const period = periodRaw.includes('p') ? 'PM' : 'AM';
        
        console.log('Parsing with minutes:', { hour, minute, periodRaw, period });
        
        // Convert hour to 24-hour format if PM
        if (period === 'PM' && hour < 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
        
        // Convert back to 12-hour format for display
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        dueTime = `${displayHour}:${minute} ${period}`;
      } else if (timeMatch[2] && !timeMatch[3]) {
        // Format: 23:30 (24-hour)
        const hour = parseInt(timeMatch[1]);
        const minute = timeMatch[2];
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        dueTime = `${displayHour}:${minute} ${period}`;
      } else {
        // Format: 11pm (no minutes)
        let hour = parseInt(timeMatch[1]);
        const periodRaw = timeMatch[2] ? timeMatch[2].toLowerCase().replace(/\./g, '') : '';
        const period = periodRaw.includes('p') ? 'PM' : periodRaw.includes('a') ? 'AM' : '';
        
        console.log('Parsing without minutes:', { hour, periodRaw, period });
        
        // Convert hour to 24-hour format if PM
        if (period === 'PM' && hour < 12) {
          hour += 12;
        } else if (period === 'AM' && hour === 12) {
          hour = 0;
        }
        
        // Convert back to 12-hour format for display
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        dueTime = `${displayHour}:00 ${period}`;
      }
      console.log('Final parsed time:', dueTime);
      break;
    }
  }

  // Improved date patterns with better month matching
  const datePatterns = [
    // Specific dates like "20th June", "June 20th", etc.
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
  const currentYear = today.getFullYear();
  let foundDate = false;

  // Month name mapping
  const monthMap: { [key: string]: number } = {
    'january': 0, 'jan': 0, 'february': 1, 'feb': 1, 'march': 2, 'mar': 2,
    'april': 3, 'apr': 3, 'may': 4, 'june': 5, 'jun': 5,
    'july': 6, 'jul': 6, 'august': 7, 'aug': 7, 'september': 8, 'sep': 8,
    'october': 9, 'oct': 9, 'november': 10, 'nov': 10, 'december': 11, 'dec': 11
  };

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
        // Handle specific date formats like "20th June"
        if (dateMatch[1] && dateMatch[3]) {
          // Pattern: day + month (e.g., "20th June")
          const day = parseInt(dateMatch[1]);
          const monthName = dateMatch[3].toLowerCase();
          const month = monthMap[monthName];
          
          if (month !== undefined) {
            // Create date with UTC to avoid timezone issues
            const parsedDate = new Date(Date.UTC(currentYear, month, day));
            // If the date has passed this year, assume next year
            const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
            if (parsedDate < todayUTC) {
              parsedDate.setUTCFullYear(currentYear + 1);
            }
            dueDate = parsedDate.toISOString().split('T')[0];
          }
        } else if (dateMatch[1] && dateMatch[2]) {
          // Pattern: month + day (e.g., "June 20th")
          const monthName = dateMatch[1].toLowerCase();
          const day = parseInt(dateMatch[2]);
          const month = monthMap[monthName];
          
          if (month !== undefined) {
            // Create date with UTC to avoid timezone issues
            const parsedDate = new Date(Date.UTC(currentYear, month, day));
            // If the date has passed this year, assume next year
            const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
            if (parsedDate < todayUTC) {
              parsedDate.setUTCFullYear(currentYear + 1);
            }
            dueDate = parsedDate.toISOString().split('T')[0];
          }
        }
      }
      console.log('Matched date:', dateMatch, 'Result:', dueDate);
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
  const commonWords = ['call', 'finish', 'complete', 'send', 'email', 'meeting', 'task', 'project', 'report', 'by', 'at', 'on', 'in', 'the', 'and', 'or', 'but', 'for', 'with', 'from', 'to', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
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

  // Extract task name - IMPROVED logic to get clean task name
  let taskText = input;
  
  // Remove specific patterns to get clean task name
  const removePatterns = [
    // Remove priority
    /\b(p[1-4])\b/gi,
    // Remove assignee patterns
    /\b(?:assign(?:ed)?\s+to|for)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/gi,
    // Remove date patterns
    /\b(?:today|tomorrow|yesterday)\b/gi,
    /\b(?:next|this)\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month)\b/gi,
    /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi,
    /\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{1,2}(?:st|nd|rd|th)?\b/gi,
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
    /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g,
    // Remove time patterns (improved to catch various formats)
    /\b(?:at|by)\s+\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)?\b/gi,
    /\b\d{1,2}(?::\d{2})?\s*(?:a\.?m\.?|p\.?m\.?)\b/gi,
    // Remove trailing prepositions and "by" phrases
    /\s+by\s*$/gi,
    /\s+at\s*$/gi,
    /\s+on\s*$/gi,
    /\s+by\s+\d/gi,
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
