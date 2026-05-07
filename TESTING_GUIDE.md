# Login Portals - Quick Start & Testing Guide

## 🚀 Getting Started

### Start Development Server
```bash
cd project-monitor
npm start
```

The app will open at `http://localhost:3000` with the new landing portal.

---

## 🧪 Testing the Login Flow

### Test 1: Landing Portal (Role Selection)
**Steps:**
1. App loads → See landing portal with two option cards
2. **Verify:**
   - ✅ Project Monitor branding visible
   - ✅ Two portal cards displayed (Admin & User)
   - ✅ Cards show features list
   - ✅ Buttons are clickable

**Expected Result:** Two professional portal cards with hover animations

---

### Test 2: Admin Portal Login
**Steps:**
1. Click "Admin Login" card on landing portal
2. Navigate to admin login page
3. **Verify:**
   - ✅ Left column shows brand story (blue gradient)
   - ✅ Right column shows login form
   - ✅ "Back to Portal Selection" link at top
   - ✅ Form has fields: Email, Password, Admin Role
   - ✅ Can select different admin roles
   - ✅ Remember me checkbox visible
   - ✅ Sign-in button works

**Expected Result:** Professional split-layout login page with working form

---

### Test 3: Admin Portal - Form Interaction
**Steps:**
1. On admin login form, enter test credentials:
   - Email: `admin@example.com`
   - Password: `password123`
   - Role: `Director General (Full Access)`
2. Click "Sign In to Dashboard"
3. **Verify:**
   - ✅ Button shows "Signing in..." text
   - ✅ Loading animation (opacity reduction)
   - ✅ After ~600ms, proceeds to dashboard
   - ✅ User badge shows logged-in user

**Expected Result:** Successfully navigates to dashboard with admin role

---

### Test 4: Back Navigation from Admin
**Steps:**
1. From admin login page, click "Back to Portal Selection"
2. **Verify:**
   - ✅ Returns to landing portal
   - ✅ Both portal cards visible again
   - ✅ No data loss
   - ✅ Can select different portal

**Expected Result:** Smooth navigation back to landing

---

### Test 5: User Portal Login
**Steps:**
1. From landing portal, click "User Login" card
2. Navigate to user login page
3. **Verify:**
   - ✅ Centered single-column layout
   - ✅ Project Monitor branding at top
   - ✅ "USER PORTAL" designation visible
   - ✅ Form with Email and Password fields
   - ✅ "Sign in with SSO" button visible
   - ✅ Features/benefits section on right (or below on mobile)
   - ✅ Remember me and forgot password options

**Expected Result:** Clean, user-friendly login interface

---

### Test 6: User Portal - Form Submission
**Steps:**
1. On user login form:
   - Email: `user@example.com`
   - Password: `password123`
2. Click "Sign In"
3. **Verify:**
   - ✅ Button shows loading state
   - ✅ After ~600ms, navigates to dashboard
   - ✅ User role is Urban (read-only)

**Expected Result:** Successfully navigates to dashboard with user role

---

### Test 7: Back Navigation from User
**Steps:**
1. From user login page, click "Back to Portal Selection"
2. **Verify:**
   - ✅ Returns to landing portal instantly
   - ✅ Form data cleared
   - ✅ Can select admin or user again

**Expected Result:** Clean navigation without form data persistence

---

### Test 8: Theme Toggle Integration
**Steps:**
1. On landing portal, toggle theme button (header)
2. **Verify:**
   - ✅ Landing portal updates to dark theme
   - ✅ Card backgrounds change
   - ✅ Text colors adjust
   - ✅ Gradients still visible

3. Navigate to admin login
4. **Verify:**
   - ✅ Blue gradient brand column adapts to dark theme
   - ✅ Form background is dark panel color
   - ✅ All inputs have correct contrast

5. Back to landing, toggle to light theme
6. Go to user portal
7. **Verify:**
   - ✅ Form has light background
   - ✅ Benefits section shows green accent
   - ✅ All elements properly themed

**Expected Result:** All portals support light/dark theme seamlessly

---

## 📱 Mobile Responsive Testing

### Mobile Portrait (<780px)
**Landing Portal:**
```
Expected: Header stacks vertically
□ Project Monitor logo above text
□ Portal cards stack to single column
□ Cards full width (with padding)
□ Touch-friendly button size (>44px)
```

**Admin Portal:**
```
Expected: Single column layout
□ Brand content on top
□ Form content below
□ All inputs full width
□ Back button accessible at top
□ Form fits within viewport without scroll
```

**User Portal:**
```
Expected: Centered, full-width mobile layout
□ Header centered above form
□ Form takes full width (with padding)
□ Benefits section below form (or stackable)
□ All buttons ≥44px height
□ No horizontal scrolling
```

### Tablet Landscape (900-1100px)
**Admin Portal:**
```
Expected: Transition state
□ Brand and form may start to compress
□ Or stack depending on exact width
□ All elements readable
□ No overlapping text
```

### Desktop (>1100px)
**All Portals:**
```
Expected: Full design as specified
□ Landing: 2-column card grid
□ Admin: 1.3:1 split layout
□ User: 500px centered
□ All shadows and effects visible
```

---

## 🎨 Visual Testing Checklist

### Colors & Styling
- [ ] Landing portal cards have correct border colors
- [ ] Admin portal brand column has gradient (navy → cyan)
- [ ] User portal form has light background
- [ ] All buttons have gradient background
- [ ] Hover effects work (lift up, shadow)
- [ ] Focus states show blue glow on inputs
- [ ] Text has proper contrast
- [ ] Dark theme inverts colors correctly

### Typography
- [ ] Headings use Space Grotesk font
- [ ] Body text uses Manrope font
- [ ] Font sizes match design specs
- [ ] Font weights appear correct (bold, regular)
- [ ] Letter spacing feels right
- [ ] Line heights allow easy reading

### Layout & Spacing
- [ ] Landing portal cards evenly spaced
- [ ] Form fields have consistent padding
- [ ] Buttons align with form width
- [ ] No elements too close together
- [ ] Consistent margins/gutters
- [ ] Proper spacing on mobile

### Icons & Images
- [ ] Portal card icons (👤👥) render correctly
- [ ] Feature icons display properly
- [ ] All emoji are visible and clear
- [ ] Icons aligned consistently

### Interactions
- [ ] Hover animations smooth and elegant
- [ ] Click feedback immediate
- [ ] Loading states visible
- [ ] Transitions feel polished
- [ ] No lag or stuttering
- [ ] Smooth scrolling behavior

---

## 🔄 User Flow Testing

### Complete Admin Flow
```
1. Landing Page
   ↓ Click "Admin Login"
2. Admin Login Form
   ↓ Enter credentials
   ↓ Select role
3. Sign In Button
   ↓ Loading state
4. Dashboard (Admin)
   ↓ Verify admin role active
   ↓ Sign out button
5. Back to Landing
   ✅ User logged out
```

### Complete User Flow
```
1. Landing Page
   ↓ Click "User Login"
2. User Login Form
   ↓ Enter credentials
   ↓ (or click SSO)
3. Sign In Button
   ↓ Loading state
4. Dashboard (User)
   ↓ Verify user role active
   ↓ Limited features (read-only)
   ↓ Sign out button
5. Back to Landing
   ✅ User logged out
```

### Back Navigation Flow
```
1. Landing Portal
   ↓ Click "Admin Login"
2. Admin Portal
   ↓ Click "Back"
   ↓ Landing Portal
   ↓ Click "User Login"
3. User Portal
   ↓ Click "Back"
   ↓ Landing Portal
   ✅ Multiple navigations work
```

---

## ⌨️ Keyboard Navigation Testing

### Tab Order (Admin Portal)
```
1. Back button
2. Email input field
3. Password input field
4. Admin role dropdown
5. Remember me checkbox
6. Sign In button
7. Footer link
```

### Tab Order (User Portal)
```
1. Back button
2. Email input field
3. Password input field
4. Remember me checkbox
5. Sign In button
6. SSO button
7. Request access link
```

**Test by:** Repeatedly pressing Tab and Shift+Tab, verify logical order

---

## ♿ Accessibility Testing

### Color Contrast
**Check using:** Browser DevTools or axe DevTools
- [ ] Text on backgrounds passes WCAG AA (4.5:1)
- [ ] Buttons have sufficient contrast
- [ ] Links are distinguishable
- [ ] Dark theme text readable

### Focus Indicators
- [ ] All interactive elements have visible focus state
- [ ] Focus order is logical (top to bottom)
- [ ] Focus not hidden or too subtle
- [ ] Focus works after mouse click

### Screen Reader (Optional)
**Test with:** VoiceOver (Mac), Narrator (Windows), or NVDA
- [ ] Form labels announced correctly
- [ ] Buttons describe their action
- [ ] Required fields indicated
- [ ] Error messages readable

### Form Validation (Optional)
- [ ] Error messages clear and specific
- [ ] Invalid fields highlighted
- [ ] Helpful hints provided
- [ ] Recovery path clear

---

## 🐛 Bug Tracking

### Common Issues to Check

**Issue 1: Forms Not Submitting**
```
Cause: JavaScript error, form validation
Fix: Check browser console for errors
Verify: Email/password fields not empty
```

**Issue 2: Styling Not Applying**
```
Cause: GlobalStyles.js not loaded
Fix: Check DevTools → Elements → <style> tag
Verify: CSS custom properties (--acc, --bg) set
```

**Issue 3: Navigation Not Working**
```
Cause: Mode state not updating
Fix: Check React DevTools → Component state
Verify: setMode() called correctly
```

**Issue 4: Mobile Layout Broken**
```
Cause: Breakpoint not triggered
Fix: Check viewport width in DevTools
Verify: Media queries in GlobalStyles
Resize: Browser window to test
```

**Issue 5: Theme Not Switching**
```
Cause: data-theme attribute not set
Fix: Check html element in DevTools
Verify: ThemeContext updating correctly
```

---

## 📊 Performance Testing

### Load Time
- [ ] Landing portal loads in <2 seconds
- [ ] Portal pages transition smoothly (<300ms)
- [ ] No lag during interactions
- [ ] Smooth animations at 60fps

### Bundle Size
```
Expected: ~230 KB (after gzip)
Current: Check via: npm run build → file sizes

If larger:
- Check for unnecessary imports
- Review CSS duplication
- Consider code-splitting
```

### Memory Usage
- [ ] No memory leaks on repeated navigation
- [ ] Theme toggle doesn't increase memory
- [ ] Clean state management

---

## ✅ Pre-Launch Checklist

### Visual
- [ ] Landing portal looks professional
- [ ] Admin and user portals distinct
- [ ] Colors match design specs
- [ ] Responsiveness works well
- [ ] Dark/light theme working
- [ ] No broken layouts

### Functional
- [ ] Login forms submit correctly
- [ ] Back buttons navigate cleanly
- [ ] No console errors
- [ ] Loading states work
- [ ] Theme toggle integrates
- [ ] All buttons clickable

### Content
- [ ] All text accurate
- [ ] No typos or grammar errors
- [ ] Messaging clear and helpful
- [ ] Branding consistent
- [ ] Feature descriptions accurate

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast sufficient
- [ ] Labels properly associated
- [ ] Error messages helpful

### Performance
- [ ] Page loads fast
- [ ] Interactions smooth
- [ ] No lag or stuttering
- [ ] Bundle size acceptable
- [ ] Mobile performance good

---

## 🎯 Testing Scenarios

### Scenario 1: New User (First Time)
1. User lands on site
2. Sees landing portal with options
3. Reads feature descriptions
4. Chooses User Portal
5. Attempts login with wrong password
6. Gets error message (if implemented)
7. Tries correct credentials
8. Successfully navigates to dashboard

### Scenario 2: Admin Returning User
1. Admin bookmarks admin login page URL (if direct access added)
2. Or goes through landing portal
3. Selects Admin Portal
4. Remembers admin login
5. Logs in quickly
6. Accesses full dashboard

### Scenario 3: Mobile User
1. User on mobile device
2. Lands on responsive landing page
3. Portal cards stack vertically
4. Selects user portal
5. Enters credentials on mobile
6. Form fits screen without overflow
7. Successfully logs in
8. Dashboard responsive and usable

---

## 📝 Testing Log Template

```
Date: [Date]
Tester: [Name]
Browser: [Chrome/Firefox/Safari/Edge]
Device: [Desktop/Tablet/Mobile]
Viewport: [Dimensions]

TEST: [Test name]
Steps: [Steps taken]
Expected: [Expected result]
Actual: [Actual result]
Status: PASS / FAIL
Notes: [Any observations]

Issues Found:
1. [Issue description] - Priority: HIGH/MEDIUM/LOW
2. [Issue description] - Priority: HIGH/MEDIUM/LOW

Suggestions:
1. [Suggestion for improvement]
2. [Suggestion for improvement]

Overall Status: ✅ READY / ⚠️ NEEDS FIXES / ❌ BLOCKED
```

---

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] All tests pass
- [ ] No console errors
- [ ] No warning messages
- [ ] Build completes successfully
- [ ] Performance acceptable
- [ ] Security review done
- [ ] Backup created
- [ ] Rollback plan ready

---

## 📞 Troubleshooting

### Q: Login not working?
**A:** Check that backend API is running on port 5000. Verify REACT_APP_API_BASE environment variable.

### Q: Styles not applying?
**A:** Check browser DevTools for CSS in `<style>` tag. Verify GlobalStyles.js is imported in App.js.

### Q: Navigation broken?
**A:** Check React DevTools for state management. Verify setMode() functions called correctly.

### Q: Mobile layout broken?
**A:** Resize browser window to test breakpoints. Check media queries in GlobalStyles.

### Q: Dark theme not working?
**A:** Check for `html[data-theme='dark']` attribute in DevTools. Verify ThemeContext is working.

---

**Testing Version**: 1.0  
**Last Updated**: April 2026  
**Status**: Ready for Testing ✅
