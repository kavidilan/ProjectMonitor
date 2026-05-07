# Login Portals - Visual Design Specifications

## 🎨 Landing Portal - Visual Layout

```
╔════════════════════════════════════════════════════════════════╗
║                    PROJECT MONITOR                            ║
║              Unified planning, progress and execution          ║
║                                                                ║
║                  SELECT YOUR PORTAL                           ║
║            Choose how you want to access the system            ║
║                                                                ║
║  ┌──────────────────────────┐  ┌──────────────────────────┐  ║
║  │  👤  ADMINISTRATOR       │  │  👥  USER               │  ║
║  │                          │  │                         │  ║
║  │  Full access to project  │  │  Access project data    │  ║
║  │  portfolio, analytics    │  │  and contribute updates │  ║
║  │                          │  │                         │  ║
║  │  ✓ View all projects     │  │  ✓ View project status  │  ║
║  │  ✓ Edit and update data  │  │  ✓ Submit updates       │  ║
║  │  ✓ Advanced analytics    │  │  ✓ Track milestones     │  ║
║  │  ✓ Team administration   │  │  ✓ Manage documents     │  ║
║  │                          │  │                         │  ║
║  │  [ADMIN LOGIN]           │  │  [USER LOGIN]           │  ║
║  └──────────────────────────┘  └──────────────────────────┘  ║
║                                                                ║
║           © 2026 Project Monitoring System                   ║
╚════════════════════════════════════════════════════════════════╝
```

### Design Specs
- **Width**: Full screen, centered content (max 1000px)
- **Cards**: 2-column grid, 24px gap
- **Card Size**: ~350px × 380px each
- **Card Hover**: Lift up 8px, shadow enhancement
- **Colors**: Admin = Blue accent, User = Green accent
- **Typography**: 
  - Title: Space Grotesk 28px bold
  - Subtitle: Manrope 14px medium
  - Features: Manrope 12px medium

---

## 🔐 Administrator Portal - Visual Layout

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║  ┌─────────────────────────────────────┬──────────────────────────────────┐  ║
║  │                                     │  [← Back to Portal Selection]    │  ║
║  │                                     │                                  │  ║
║  │  ADMINISTRATOR PORTAL               │  ADMINISTRATOR SIGN IN           │  ║
║  │  (Gradient Blue)                    │                                  │  ║
║  │                                     │  Enter your credentials to       │  ║
║  │  Manage your project portfolio      │  access the administration       │  ║
║  │  with advanced tools and            │  dashboard                       │  ║
║  │  comprehensive insights.            │                                  │  ║
║  │                                     │  ┌─────────────────────────────┐ │  ║
║  │  📊 Analytics                       │  │ Email Address               │ │  ║
║  │  Deep dive into project metrics     │  │ admin@example.com           │ │  ║
║  │                                     │  └─────────────────────────────┘ │  ║
║  │  👥 Team Management                │                                  │  ║
║  │  Oversee all team members           │  ┌─────────────────────────────┐ │  ║
║  │                                     │  │ Password                    │ │  ║
║  │  ⚙️  System Configuration           │  │ •••••••••••••••             │ │  ║
║  │  Configure portfolio settings       │  └─────────────────────────────┘ │  ║
║  │                                     │                                  │  ║
║  │                                     │  ┌─────────────────────────────┐ │  ║
║  │                                     │  │ Admin Role                  │ │  ║
║  │                                     │  │ > Director General (Full)   │ │  ║
║  │                                     │  └─────────────────────────────┘ │  ║
║  │                                     │                                  │  ║
║  │                                     │  ☑ Remember me on device        │  ║
║  │                                     │                 Forgot password? │  ║
║  │                                     │                                  │  ║
║  │                                     │  [SIGN IN TO DASHBOARD]          │  ║
║  │                                     │                                  │  ║
║  │                                     │  Need help? Contact support      │  ║
║  │                                     │                                  │  ║
║  └─────────────────────────────────────┴──────────────────────────────────┘  ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

### Design Specs
- **Layout**: 1.3:1 grid split (brand : form)
- **Brand Column**:
  - Background: Linear gradient (Navy #0c4a6e → Sky #0369a1 → Cyan #0284c7)
  - Text: White (#fff)
  - Accent: Radial gradient overlay (subtle white circles)
  - Padding: 48px 40px
- **Form Column**:
  - Background: Light panel (95% opaque)
  - Padding: 48px 40px
- **Form Elements**:
  - Input fields: 11px padding, 10px border-radius
  - Focus state: Blue border + glow shadow
  - Labels: 12px bold, dark text
  - Buttons: Gradient linear (cyan → blue), shadow
- **Responsive**: Breaks to single column below 1100px

---

## 👥 User Portal - Visual Layout

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              [← Back to Portal Selection]                       ║
║                                                                  ║
║                              PM                                 ║
║                        PROJECT MONITOR                          ║
║                         USER PORTAL                             ║
║                                                                  ║
║          ┌────────────────────────────────────────┐             ║
║          │                                        │             ║
║          │        SIGN IN                         │             ║
║          │  Access your project dashboard and    │             ║
║          │  collaborate with your team            │             ║
║          │                                        │             ║
║          │ ┌──────────────────────────────────┐  │             ║
║          │ │ Email Address                    │  │             ║
║          │ │ your.email@example.com           │  │             ║
║          │ └──────────────────────────────────┘  │             ║
║          │                                        │             ║
║          │ ┌──────────────────────────────────┐  │             ║
║          │ │ Password                         │  │             ║
║          │ │ ••••••••••••••••                │  │             ║
║          │ └──────────────────────────────────┘  │             ║
║          │                                        │             ║
║          │ ☑ Remember me    Forgot password?     │             ║
║          │                                        │             ║
║          │      [SIGN IN]                        │             ║
║          │          — or —                       │             ║
║          │  [SIGN IN WITH SSO]                   │             ║
║          │                                        │             ║
║          │  Don't have account? Request access    │             ║
║          │                                        │             ║
║          └────────────────────────────────────────┘             ║
║                                                                  ║
║          ┌────────────────────────────────────────┐             ║
║          │  WHAT YOU CAN DO                       │             ║
║          │  📌 View assigned projects & tasks     │             ║
║          │  📝 Submit project updates & progress  │             ║
║          │  📅 Track milestones & deadlines       │             ║
║          │  📎 Manage project documents & media   │             ║
║          │  💬 Communicate with your team        │             ║
║          └────────────────────────────────────────┘             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Design Specs
- **Layout**: Single centered column (max width 500px)
- **Spacing**: 20px padding on all sides
- **Form Container**:
  - Background: Light panel (95% opaque + border)
  - Border-radius: 16px
  - Padding: 32px
  - Margin-bottom: 24px
- **Benefits Sidebar**:
  - Background: Green accent (8% opacity) + border (20% opacity)
  - Padding: 20px
  - Border-radius: 12px
  - List items: Emoji + text
- **Form Elements**: Same as admin (11px padding, focus glow)
- **Special**: SSO button, divider separator, signup link
- **Responsive**: Adjusts from 500px center to full mobile

---

## 🎨 Color Palette - Detailed

### Admin Portal
```
Primary Gradient:     Navy (#0c4a6e) → Sky Blue (#0369a1) → Cyan (#0284c7)
Accent Colors:        Cyan (#0ea5e9) / Blue (#0284c7)
Background:           Light (#eff4f8)
Text Primary:         Dark Navy (#11263a)
Text Secondary:       Medium (#36536e)
Borders:              Light Blue (#d0dde8)
```

### User Portal
```
Primary Gradient:     (Not used in background)
Accent Colors:        Cyan (#0ea5e9) / Green (#16a34a)
Background:           Light (#eff4f8)
Text Primary:         Dark Navy (#11263a)
Benefits Bg:          Green (8% opacity) (#16a34a)
Benefits Border:      Green (20% opacity) (#16a34a)
```

### Landing Portal
```
Portal Cards:
  - Admin:   Blue accent gradient on hover
  - User:    Green accent gradient on hover
Buttons:           Cyan → Blue gradient
Hover Effects:     Enhanced shadows, elevation
```

---

## 📐 Typography Hierarchy

### Landing Page
```
Main Title:  Space Grotesk, 32px, 700 weight, -0.5px letter-spacing
Subtitle:    Manrope, 13px, 600 weight
Card Titles: Space Grotesk, 20px, 700 weight
Card Desc:   Manrope, 13px, 400 weight (gray text)
Features:    Manrope, 12px, 600 weight
Button:      Manrope, 13px, 700 weight
```

### Admin Portal
```
Brand Title:     Space Grotesk, 42px, 700 weight (white)
Brand Desc:      Manrope, 16px, 400 weight (white)
Feature Titles:  Manrope, 14px, 700 weight (white)
Feature Desc:    Manrope, 12px, 400 weight (white)
Form Title:      Space Grotesk, 26px, 700 weight
Form Desc:       Manrope, 13px, 400 weight
Label:           Manrope, 12px, 700 weight
Input:           Manrope, 13px, 600 weight
Button:          Manrope, 13px, 700 weight
Footer Link:     Manrope, 12px, 700 weight
```

### User Portal
```
Header Title:    Space Grotesk, 24px, 700 weight
Header Port:     Manrope, 12px, 700 weight uppercase
Form Title:      Space Grotesk, 22px, 700 weight
Form Subtitle:   Manrope, 13px, 400 weight
Label:           Manrope, 12px, 700 weight
Input:           Manrope, 13px, 600 weight
Divider Text:    Manrope, 12px, 400 weight (gray)
Button:          Manrope, 13px, 700 weight
Benefits Title:  Manrope, 13px, 700 weight uppercase
Benefits Item:   Manrope, 12px, 600 weight
```

---

## 🎯 Button Styles

### Primary Button (Primary CTA)
```
State: Default
  Background: Linear gradient (Cyan #0ea5e9 → Blue #0284c7)
  Color: White
  Padding: 12px 16px
  Border-radius: 10px
  Font: Manrope 13px bold
  Shadow: 0 10px 20px rgba(14,165,233,0.2)
  
State: Hover
  Transform: translateY(-1px)
  Shadow: 0 15px 30px rgba(14,165,233,0.3)
  
State: Active
  Transform: translateY(0)
  
State: Disabled
  Opacity: 0.7
```

### Secondary Button (SSO/Alternative)
```
State: Default
  Background: White
  Border: 1px solid var(--bd)
  Color: Dark text
  Padding: 12px 16px
  Border-radius: 10px
  
State: Hover
  Border-color: Cyan (#0ea5e9)
  Background: Light cyan tint (6%)
```

### Portal Card Button
```
State: Default
  Background: Linear gradient (Cyan → Blue)
  Color: White
  Padding: 12px 24px
  Border-radius: 10px
  Shadow: 0 10px 20px rgba(14,165,233,0.2)
  
State: Hover
  Transform: translateY(-2px)
  Shadow: 0 15px 30px rgba(14,165,233,0.3)
```

---

## 📱 Responsive Breakpoints

### Desktop (>1100px)
- Landing: 2-column card grid (600px cards + gaps)
- Admin: 1.3:1 split layout shown full
- User: 500px max-width centered
- All elements visible, no truncation

### Tablet (900-1100px)
- Landing: 2-column cards (responsive)
- Admin: Transitions from 2-column to stacked
- Padding: 32px 24px (reduced)
- Typography: Slight size reduction

### Mobile (<780px)
- Landing: 1-column card stacking
- Admin: Full height single column
- User: Full width, minimal margins
- Font sizes: Reduced 10-15%
- Padding: 24px (minimal sides)
- Min-height buttons: 48px (touch-friendly)

---

## ✨ Interaction Effects

### Portal Card Hover
```
Transform: translateY(-8px)
Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
Shadow Enhancement: 0 20px 40px rgba(14,165,233,0.15)
Border Color: Change to accent color
```

### Button Hover
```
Primary Button:
  Transform: translateY(-1px)
  Transition: 0.2s ease
  Shadow: Enhanced

Portal Card Button:
  Transform: translateY(-2px)
  Transition: 0.2s ease
```

### Form Input Focus
```
Border Color: var(--acc) [Cyan]
Box-shadow: 0 0 0 3px rgba(14,165,233,0.1)
Transition: 0.2s ease
```

### Navigation
```
Back Button:
  Default: Color cyan
  Hover: Color darker blue + underline
  Transition: 0.2s ease

Links:
  Default: Color cyan
  Hover: Color darker blue + underline
  Duration: 0.2s
```

---

## 🌙 Dark Mode Support

All elements support dark theme via `html[data-theme='dark']` selector:

### Dark Theme Tokens
```
--bg: #071521              (Very dark blue)
--panel: #102334           (Dark panel)
--tx-1: #e4effa            (Light text)
--tx-2: #96b4cc            (Medium text)
--bd: #26435b              (Dark borders)
--acc: #38bdf8             (Lighter cyan)
--acc-2: #0ea5e9           (Cyan accent)
```

### Landing Page (Dark)
- Background: Dark gradients still apply
- Cards: Dark panel background
- Text: Light colors inverted

### Admin Portal (Dark)
- Brand column: Darker gradient (navy shifted)
- Form column: Dark panel
- Inputs: Dark background, light borders

### User Portal (Dark)
- Form container: Dark panel
- Inputs: Dark background
- Benefits box: Green tint on dark

---

## 📊 Loading States

### Sign-in Button Loading
```
Button Text: "Signing in..." (during loading)
Button Text: "Sign In" (default)
Duration: ~600ms animation
Visual Feedback: Button opacity slightly reduced
```

---

## 💬 Form Validation Messages

### Example Implementation (Optional)
```javascript
// Email validation
❌ "Please enter a valid email address"
✅ "Email is valid"

// Password validation
❌ "Password must be at least 8 characters"
✅ "Password is strong"

// Required fields
❌ "This field is required"

// Display positioning: Below input, same color as error tone
```

---

## 🎓 Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile Browsers**: Fully responsive
- **IE11**: Not supported (modern CSS only)

---

## 📦 Assets & Resources

### Icons Used
- 👤 Admin (Unicode)
- 👥 Users (Unicode)
- 📊 Analytics (Unicode)
- ⚙️ Settings (Unicode)
- 📌 Pin (Unicode)
- 📝 Document (Unicode)
- 📅 Calendar (Unicode)
- 📎 Attachment (Unicode)
- 💬 Chat (Unicode)

### Fonts Imported
```
Family: Manrope
Weights: 500, 600, 700, 800

Family: Space Grotesk
Weights: 600, 700

Family: JetBrains Mono
Weights: 600, 700
```

---

**Design Version**: 1.0  
**Last Updated**: April 2026  
**Compliance**: WCAG AA compliant, Mobile-first responsive
