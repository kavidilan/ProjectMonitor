# Professional Spreadsheet Data Entry Table - Implementation Guide

## 🎯 Overview

The DataEntryTable component has been redesigned to match a professional project tracking spreadsheet format, featuring:

- **Comprehensive column structure** matching industry-standard project tracking templates
- **Monthly tracking** with PT/PP/FT/FP (Physical Target/Progress, Financial Target/Progress)
- **Cumulative progress** visualization
- **Horizontal scrolling** for extended data
- **Professional styling** aligned with the design system
- **Inline editing** capabilities
- **Status badges** for project health
- **Summary statistics** at the bottom

---

## 📊 Column Organization

### Section 1: Project Identification (Fixed)

```
┌─────────────────────────────────────┐
│ No │ Project Name/Sub Activities    │
└─────────────────────────────────────┘
```

- **No**: Row number for reference
- **Project Name/Sub Activities**: Full project title (220px min width)

### Section 2: Project Dates

```
┌────────────────────────────────┐
│ Date of Comm. │ Date of Comp. │
└────────────────────────────────┘
```

- **Date of Commencement** (YYYY-MM-DD format)
- **Date of Completion** (YYYY-MM-DD format)

### Section 3: Budget Allocation (€ in thousands)

```
┌──────────────────────────────────────┐
│ TBC (€,000) │ Allocation in Rs       │
└──────────────────────────────────────┘
```

- **TBC**: Total Budgeted Cost in Euro (€,000s)
- **Allocation in Rs**: Allocated amount in Rs (€,000s equivalent)

### Section 4: Cumulative Progress (as of 31.12.2025)

```
┌──────────────────────────┐
│ Physical % │ Financial % │
└──────────────────────────┘
```

- **Physical Progress**: Overall physical completion percentage
- **Financial Progress**: Overall financial utilization percentage

### Section 5: Monthly Breakdown (6 Months)

For each month (January through June):

```
┌─────────────────────────────────────┐
│ PT │ PP │ FT │ FP │
└─────────────────────────────────────┘

Where:
PT = Physical Target
PP = Physical Progress
FT = Financial Target
FP = Financial Progress
```

### Section 6: Project Outcomes

```
┌───────────────────────────────────────────┐
│ Output │ Outcome │ SDG Goal │
└───────────────────────────────────────────┘
```

- **Output**: Expected tangible deliverables
- **Outcome**: Expected impact/results
- **SDG Goal**: Aligned Sustainable Development Goal number

### Section 7: Project Status & Actions

```
┌──────────────────┐
│ Status │ Actions│
└──────────────────┘
```

- **Status**: "On Track" (green) or "Delayed" (red) badge
- **Actions**: Attach/Add/Remove buttons (for editors only)

---

## 🎨 Design Features

### Header Styling

```
Main Headers (Level 1):
- Background: var(--panel-2) [Light panel color]
- Font: 11px, 800 weight, uppercase
- Color: var(--tx-2) [Medium text]
- Letter-spacing: 0.05em
- Padding: 10px 8px

Sub Headers (Level 2):
- Background: rgba(14,165,233,0.08) [Light cyan]
- Font: 10px, 700 weight, uppercase
- Color: var(--tx-2)
- Indicates: PT/PP/FT/FP categories
```

### Table Cell Styling

```
Data Cells:
- Padding: 9px 8px
- Border: 1px solid var(--bd) [Light blue borders]
- Vertical alignment: middle
- Font size: 12px

Row Number Cell:
- Background: var(--panel-2)
- Text weight: 700
- Text color: var(--tx-2)
- Min width: 35px

Hover Effect:
- Background: rgba(var(--panel-2), 0.6) [Subtle highlight]
- Smooth transition
```

### Input Fields (Editable Cells)

```
.det-input-sm {
  - Background: var(--panel) [White]
  - Border: 1px solid var(--bd)
  - Color: var(--tx-1) [Dark text]
  - Padding: 7px 8px
  - Border-radius: 6px
  - Font size: 11px
  - Font weight: 600
  
  Focus State:
  - Border color: var(--acc) [Cyan]
  - Box shadow: 0 0 0 2px rgba(14,165,233,0.1)
  - Transitions: all 0.2s
}
```

### Status Badges

```
On Track (Green):
- Background: rgba(34,197,94,0.14)
- Color: #15803d
- Border: 1px solid rgba(34,197,94,0.25)
- Padding: 3px 8px
- Border-radius: 8px
- Font size: 10px, 700 weight

Delayed (Red):
- Background: rgba(239,68,68,0.14)
- Color: #b91c1c
- Border: 1px solid rgba(239,68,68,0.25)
```

---

## 📱 Responsive Behavior

### Desktop (>1100px)

- Full 2-row header visible
- All columns displayed with comfortable spacing
- Horizontal scroll for monthly data
- Normal button sizing

### Tablet (900-1100px)

- Columns compress slightly
- Headers remain readable
- Horizontal scroll activated for monthly columns
- Touch-friendly buttons

### Mobile (<900px)

- Project name column remains sticky (if browser supports)
- Other columns scroll horizontally
- Smaller padding for space efficiency
- Buttons remain accessible

---

## 🔧 Editable Fields

### Budget Entry

- **Type**: Number input
- **Placeholder**: "0"
- **Editable**: Yes
- **Format**: Currency in thousands (€,000)

### Monthly Data (PT/PP/FT/FP)

- **Type**: Number input
- **Placeholder**: Category indicator (PT/PP/FT/FP)
- **Editable**: Yes
- **Format**: Numeric percentage or value

### Status Fields

- **Physical %**: Display only (read-only)
- **Financial %**: Display only (read-only)
- **Status Badge**: Display only (derived from reasonsForDelays)

---

## 🎯 Key Interactions

### Search & Filter

```javascript
Search: 
- Searches project name and project ID
- Real-time filtering
- Case-insensitive

Filter Options:
- All Projects: Show all
- On Track: Projects without delays
- Delayed: Projects with delay reasons
```

### Row Clicking

- **Click on row**: Opens project detail modal (setModalProject)
- **Click on input**: Prevents row click (stopPropagation)
- **Cursor**: Pointer on rows for affordance

### Action Buttons

```
📎 Attach Button:
- Opens file upload/attach dialog
- Calls hadd(project)

➕ Plus Button:
- Increment progress or add item
- Calls hpc(project)

➖ Minus Button:
- Decrement progress or remove item
- Calls hmc(project)

💾 Save Changes Button:
- Persists all edits
- Calls handleSave()
- Shows loading state
```

---

## 📊 Summary Statistics (Bottom)

Displays real-time aggregates:

```
┌──────────────┬────────────┬──────────┬──────────────┐
│ Total        │ On Track   │ Delayed  │ Avg.         │
│ Projects     │ Projects   │ Projects │ Progress     │
├──────────────┼────────────┼──────────┼──────────────┤
│ 25           │ 18         │ 7        │ 68%          │
└──────────────┴────────────┴──────────┴──────────────┘
```

Each stat card has:

- Background: Appropriate color (green/blue/red)
- Title: Uppercase label
- Value: Large bold number
- Icon: Visual indicator
- Real-time updates: Recalculates on filter change

---

## 💡 Component Props

```javascript
DataEntryTable.propTypes = {
  projects: Array,           // Project data array
  isVO: Boolean,             // View-only mode flag
  bf: Object,                // Budget First mapping
  setBf: Function,           // Update Budget First
  ab: Object,                // Allocation mapping
  setAb: Function,           // Update Allocation
  ap2: Object,               // AP2 mapping
  setAp2: Function,          // Update AP2
  hadd: Function,            // Handle Add/Attach
  handleSave: Function,      // Handle Save
  setModalProject: Function, // Open detail modal
  hpc: Function,             // Handle Plus Click
  hmc: Function,             // Handle Minus Click
}
```

---

## 📝 Data Structure Expected

```javascript
Project object structure:
{
  _id: string,
  projectId: string,
  projectName: string,
  department: string,
  budgetLine: string,
  dateOfCommencement: ISO-8601 date,
  dateOfCompletion: ISO-8601 date,
  budgetAllocation: number,        // TBC in €,000
  allocationRs: number,            // Allocation in Rs
  physicalProgress: number,        // 0-100
  financialProgress: number,       // 0-100
  output: string,                  // Output description
  outcome: string,                 // Outcome description
  sustainableDevelopmentGoal: string, // "Goal No: XX"
  reasonsForDelays: string,        // If empty = On Track
  measures: {                      // Monthly data
    january: { PT, PP, FT, FP },
    february: { PT, PP, FT, FP },
    // ... up to June
  }
}
```

---

## 🎨 Color Token Integration

```css
/* Primary Colors */
--acc: #0ea5e9              /* Cyan accent */
--acc-2: #0284c7            /* Blue accent */

/* Neutrals */
--panel: #ffffff            /* Cell backgrounds */
--panel-2: #eef3f8          /* Header backgrounds */
--bd: #d0dde8               /* Borders */

/* Text */
--tx-1: #11263a             /* Primary text */
--tx-2: #36536e             /* Secondary text */
--tx-3: #63809c             /* Tertiary text */

/* Status Colors */
--good: #16a34a             /* Green (on-track) */
--bad: #ef4444              /* Red (delayed) */
```

---

## 🔄 State Management

### Filter State

```javascript
const [filterStatus, setFilterStatus] = useState('ALL');
// Values: 'ALL' | 'ON_TRACK' | 'DELAYED'
```

### Search State

```javascript
const [searchTerm, setSearchTerm] = useState('');
// Filters projects in real-time
```

### No Sort State (Simplified)

- Removed in new version for cleaner implementation
- Projects display in array order
- Can be re-added if sorting feature is needed

---

## 📋 Usage Example

```javascript
<DataEntryTable
  projects={projects}
  isVO={userRole === 'DDG_URBAN'}
  bf={budgetFirst}
  setBf={setBudgetFirst}
  ab={allocation}
  setAb={setAllocation}
  ap2={ap2Data}
  setAp2={setAp2Data}
  hadd={handleAddAttachment}
  handleSave={handleSaveAll}
  setModalProject={openDetailModal}
  hpc={handlePlusClick}
  hmc={handleMinusClick}
/>
```

---

## ✨ Features Implemented

✅ **Professional spreadsheet layout**
✅ **Multi-header structure**
✅ **Monthly tracking columns**
✅ **Cumulative progress display**
✅ **Inline editable cells**
✅ **Real-time search & filter**
✅ **Status badges (On Track/Delayed)**
✅ **Summary statistics**
✅ **Horizontal scrolling for extended data**
✅ **Responsive design**
✅ **Theme support (light/dark)**
✅ **WCAG AA accessible**
✅ **Touch-friendly interactions**
✅ **View-only mode support**
✅ **Action buttons integration**

---

## 🚀 Future Enhancements

⏳ **Sorting**: Add click-to-sort headers
⏳ **Export**: CSV/Excel export functionality
⏳ **Grouping**: Group by department/budget line
⏳ **Pagination**: Handle large datasets
⏳ **Column Customization**: Show/hide columns
⏳ **Bulk Actions**: Select multiple rows
⏳ **Validation**: Client-side data validation
⏳ **Audit Trail**: Track changes history

---

## 🧪 Testing Checklist

- All columns display correctly on desktop
- Horizontal scroll works for monthly data
- Search filters projects in real-time
- Status filter works (All/On Track/Delayed
- Inline inputs are editable
- Save button works
- Summary stats update on filter
- Responsive on tablet/mobile
- Theme toggle switches colors
- Status badges display correctly
- Row click opens detail modal
- Action buttons are functional
- Read-only mode hides edit buttons
- Date formatting is consistent
- Numbers are right-aligned and readable

---

**Component**: DataEntryTable  
**File**: `src/components/DataEntryTable.js`  
**Lines**: 285+  
**Status**: ✅ Production Ready  
**Last Updated**: April 2026