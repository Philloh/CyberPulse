# Dynamic Meetups - Implementation Visual Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      USER VISITS /meetups                           │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │   useEvents() Hook        │
                    │   (Mounted on page)       │
                    └────────────┬──────────────┘
                                 │ Fetch on mount
                    ┌────────────▼──────────────┐
                    │  GET /api/events          │
                    │  (REST Endpoint)          │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │ getCTFEvents()            │
                    │ (Aggregation Engine)      │
                    └────────────┬──────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
     ┌──────────▼─────┐  ┌───────▼───────┐  ┌───▼─────────────┐
     │ CTFRoom API    │  │ CTFTime API   │  │ Bug Bounty KE   │
     │ v1/events      │  │ v1/events/    │  │ /api/events     │
     └────────────────┘  └───────────────┘  └─────────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │ Deduplication            │
                    │ (Remove duplicates)      │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │ Kenya Filtering          │
                    │ (Country & tags)         │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │ Return to /api/events     │
                    │ (JSON response)           │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │ Hook receives data        │
                    │ Updates state             │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │ Re-render UI              │
                    │ Show events grid          │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │ Set auto-refresh timer    │
                    │ (1 hour interval)         │
                    └────────────┬──────────────┘
                                 │
                    ┌────────────▼──────────────┐
                    │ User sees:                │
                    │ - Event grid              │
                    │ - Last updated timestamp  │
                    │ - Search box              │
                    │ - Filter buttons          │
                    │ - Refresh button          │
                    └───────────────────────────┘
```

## Component State Flow

```
┌────────────────────────────────────────┐
│      Page Component State              │
├────────────────────────────────────────┤
│ const [search, setSearch] = ''         │
│ const [mode, setMode] = 'All'          │
│ const [selectedMeetup, setSel] = null  │
│ const [isCalendarOpen, setIsCalOpen]   │
│                                        │
│ const { events, loading, error,        │
│         lastFetched, refetch,          │
│         eventCount } = useEvents()     │
│                                        │
│ const filtered = useMemo(() => {       │
│   return events.filter(...)            │
│ }, [events, search, mode])             │
│                                        │
│ return (                               │
│   <Page with UI showing>               │
│     - Loading state                    │
│     - Error state                      │
│     - Search box                       │
│     - Filter buttons                   │
│     - Event grid                       │
│     - Last updated                     │
│     - Refresh button                   │
│     - Calendar modal                   │
│   )                                    │
└────────────────────────────────────────┘
```

## Data Structure

```
CTFEvent {
  ├─ id: "string"
  ├─ title: "Event Name"
  ├─ date: "2025-12-06T09:00:00Z"
  ├─ location: {
  │  ├─ name: "Venue Name"
  │  ├─ city: "Nairobi"
  │  ├─ country: "Kenya"
  │  └─ maps: "https://..."
  │ }
  ├─ mode: "In-person|Virtual|Hybrid"
  ├─ university: "Organization Name"
  ├─ description: "Event description..."
  ├─ tags: ["CTF", "Training", "Beginner"]
  ├─ capacity: 300
  ├─ rsvpUrl: "https://register.com"
  ├─ teamSize: "2-4 people"
  ├─ registrationDeadline: "2025-12-01T23:59:00Z"
  ├─ eligibility: "All students"
  ├─ requirements: ["Laptop", "Linux"]
  ├─ prizes: [
  │  { place: "1st", prize: "Prize 1" },
  │  { place: "2nd", prize: "Prize 2" }
  │ ]
  └─ sponsors: ["Sponsor1", "Sponsor2"]
}
```

## Request/Response Flow

### Request 1: Page Load
```
GET /meetups
│
└─→ Browser renders page
    └─→ useEvents() runs on mount
        └─→ Fetch /api/events
```

### Response 1: API Returns Events
```
GET /api/events
│
└─→ Response: {
    "success": true,
    "count": 15,
    "lastFetched": "2025-11-17T14:30:00Z",
    "events": [
      { id: "event1", title: "...", ... },
      { id: "event2", title: "...", ... },
      ...
    ]
   }
```

### State Updates
```
Hook State:
  loading: true → false
  events: [] → [event1, event2, ...]
  lastFetched: null → "2025-11-17T14:30:00Z"
  eventCount: 0 → 15
  error: null (unless API fails)
```

### UI Updates
```
Display:
  1. Remove "Loading..." message
  2. Show events in grid
  3. Show "Last updated: 14:30"
  4. Show "Found X events (Y total)"
  5. Enable search/filter
```

## Timeline: What Happens When

```
┌──────────────────────────────────────────────────────────┐
│ USER VISITS /meetups AT 2:00 PM                         │
└──────────────────────────────────────────────────────────┘

2:00:00 PM
│ Page loads
├─ useEvents() runs
├─ "Loading..." message shows
├─ Fetch /api/events starts
│
2:00:02 PM
├─ APIs respond (CTFRoom, CTFTime, Bug Bounty Kenya)
├─ Deduplication runs
├─ Filtering runs
│
2:00:03 PM
├─ Response sent to hook
├─ State updates: events loaded
├─ "Loading..." hidden
├─ Events render in grid
├─ "Last updated: 2:00 PM" shows
├─ "Refresh" button enabled
│
2:00:03 PM - 3:00:03 PM
├─ User interacts with page
├─ Search works
├─ Filters work
├─ Calendar works
│
3:00:03 PM (AUTO-REFRESH)
├─ 1-hour interval triggers
├─ useEvents() calls refetch()
├─ Fetch /api/events again
│
3:00:05 PM
├─ New data received
├─ State updates
├─ "Last updated: 3:00 PM" shows
├─ Events may change if new ones posted
│
REPEAT EVERY HOUR...

USER CAN ALSO CLICK "Refresh" ANYTIME
├─ Manually triggers refetch
├─ Icon spins while loading
├─ New data loaded immediately
```

## Error Handling Flow

```
┌─────────────────────────────────┐
│ Fetch /api/events               │
└──────────────┬──────────────────┘
               │
        ┌──────▼───────┐
        │ API Responds │
        └──────┬───────┘
               │
        ┌──────▼────────────────┐
        │ Success (200)?        │
        ├──────┬───────────────┐
        │ YES  │  NO           │
        │      │               │
    ┌───▼──┐ ┌─▼──────────┐
    │Render│ │Error catch │
    │Events│ └──┬────────┘
    │Grid  │   │
    └──────┘   ├─ Set error state
               ├─ Show red error box
               ├─ Show "Try Again" button
               ├─ Log error
               ├─ Return fallback events
               │
               └─ Display:
                  "Error loading events"
                  "Try Again [Button]"
```

## Caching Behavior

```
┌──────────────────────────────────────────────────────┐
│ REQUEST #1: GET /api/events                          │
├──────────────────────────────────────────────────────┤
│ Time: 2:00 PM                                        │
│ Source: External APIs (fresh)                        │
│ Response Headers:                                    │
│   Cache-Control: public, s-maxage=3600,              │
│                  stale-while-revalidate=7200         │
│ Client receives: Full fresh data                     │
│                                                      │
├──────────────────────────────────────────────────────┤
│ REQUEST #2: GET /api/events (2:15 PM)                │
├──────────────────────────────────────────────────────┤
│ Response: CACHED (from server cache)                 │
│ Same data as REQUEST #1                              │
│ No external API calls made                           │
│ Time to response: < 10ms                             │
│                                                      │
├──────────────────────────────────────────────────────┤
│ REQUEST #3: GET /api/events (3:01 PM)                │
├──────────────────────────────────────────────────────┤
│ Cache expired after 1 hour                           │
│ Source: External APIs (fresh)                        │
│ May have new events from CTFRoom, CTFTime, BBK       │
│ User sees updated data                               │
│                                                      │
├──────────────────────────────────────────────────────┤
│ ISR (Incremental Static Regeneration)                │
├──────────────────────────────────────────────────────┤
│ Next.js serves cached page for next 1 hour           │
│ If /api/events changes, page regenerated in bg       │
│ No page rebuild delay for users                      │
└──────────────────────────────────────────────────────┘
```

## User Interactions

```
┌─────────────────────────────────┐
│  USER ACTIONS                   │
└─────────────────────────────────┘

1. TYPE IN SEARCH BOX
   ├─ Search state updates
   └─ useFilteredEvents() runs
      └─ Grid filters in real-time (< 100ms)

2. CLICK MODE FILTER
   ├─ Mode state updates  
   └─ useFilteredEvents() runs
      └─ Grid filters in real-time (< 100ms)

3. CLICK REFRESH BUTTON
   ├─ Icon spins
   ├─ refetch() called
   └─ API called again
      └─ New data loaded

4. CLICK "ADD TO CALENDAR"
   ├─ Calendar modal opens
   ├─ Event data populated
   └─ User chooses:
      ├─ Google Calendar
      ├─ Outlook
      ├─ Apple iCal
      └─ Copy to clipboard

5. CLICK RSVP BUTTON
   └─ Opens registration link
      └─ User registers on event platform

6. PAGE AUTO-REFRESH (EVERY HOUR)
   ├─ Hook triggers automatically
   ├─ New API call made
   └─ Page updates silently
      └─ Timestamp shows "just now"
```

## Performance Metrics

```
┌───────────────────────────────────┐
│ PERFORMANCE BASELINE              │
├───────────────────────────────────┤
│ First Page Load:      ~2 seconds   │
│ (includes API fetch)              │
│                                   │
│ API Response Time:    < 5 seconds  │
│ (with all 3 APIs up)              │
│                                   │
│ Client-side Filter:   < 100ms     │
│ (instant feel)                    │
│                                   │
│ Manual Refresh:       < 2 seconds  │
│ (re-fetch + render)               │
│                                   │
│ Auto-Refresh (1hr):   Bg process  │
│ (doesn't affect UX)               │
│                                   │
│ Fallback Load:        < 100ms     │
│ (no API needed)                   │
└───────────────────────────────────┘
```

## Browser Debugging

### Network Tab
```
GET /meetups
├─ Status: 200
├─ Size: 8.52 kB
├─ Time: ~1.5s
│
GET /api/events
├─ Status: 200
├─ Size: ~50-100 kB (depends on events)
├─ Time: < 5s
├─ Headers:
│  ├─ Cache-Control: public, s-maxage=3600
│  ├─ Content-Type: application/json
│  └─ Content-Length: ...
└─ Response: {success, count, events[]}
```

### Console Errors
```
✅ Normal operation: No errors or warnings

❌ If API fails:
   - Check Network tab for failed requests
   - Look for timeout errors
   - Verify API URLs in /lib/ctf-events.ts
   - Check CORS headers (if applicable)

⚠️ Performance:
   - Monitor API response times
   - Alert if > 5 seconds
   - Check external API status
```

### Local Storage
```
Hook state:
├─ events: CTFEvent[]
├─ loading: boolean
├─ error: string | null
├─ lastFetched: string
└─ eventCount: number

Not persisted (cleared on page reload)
```

## Deployment Checklist

```
PRE-DEPLOYMENT
□ npm run build succeeds (22/22 pages)
□ 0 TypeScript errors
□ 0 warnings
□ All APIs tested and reachable
□ Fallback events working
□ Error handling tested
□ Mobile responsive tested
□ Calendar modal tested

DEPLOYMENT
□ Push code to repository
□ Deploy to hosting (Vercel, etc.)
□ Run post-deploy checks
□ Monitor API response times
□ Check error logs
□ Verify fallback usage

POST-DEPLOYMENT
□ Test in production
□ Monitor /api/events response time
□ Track error rates
□ Watch for API failures
□ Set up alerts
□ Document any issues
```

## Summary

This visual guide shows:

✅ **System Architecture** - How components communicate  
✅ **Data Flow** - From external APIs to UI  
✅ **State Management** - How component state updates  
✅ **Error Handling** - How errors are managed  
✅ **Caching Strategy** - How data is cached  
✅ **User Interactions** - What happens when user acts  
✅ **Performance** - Expected response times  
✅ **Debugging** - How to monitor and troubleshoot  

For detailed technical information, see the other documentation files.
