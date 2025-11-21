# SMS Characters: Count & Preview
**Eliminated enterprise billing risk through accurate encoding detection**

---

## IMPACT

**Financial risk eliminated:**
• **Zero billing disputes in 6+ months** (vs. multiple five-figure refund demands quarterly)
• **Prevented 3× cost overruns** from emoji/unicode encoding switches
• **Enterprise trust restored** - platform now viewed as financially reliable

**Market expansion enabled:**
• **RTL language support** (Arabic, Hebrew) unlocked Middle East markets
• **Multi-script accuracy** validated for global operations
• **Competitive parity achieved** with specialized messaging platforms

**Operational efficiency:**
• Support tickets for SMS issues **dropped significantly**
• Partners stopped using external tools for character counting
• QA approval process streamlined with clear warnings

**Timeline:** Q2 2024 (3-month sprint)  
**Team:** 6 (Product Designer, 3 Engineers, Product Manager, QA)  
**Urgency:** Crisis-driven after second major billing dispute

---

## THE PROBLEM

### Crisis Catalyst
**Multiple five-figure billing disputes within 6 months.** Partners were blindsided by SMS charges when emojis or diacritics silently pushed messages from 1 segment to 3.

### Core Issues

**Financial Risk:**
- Single emoji switches encoding from **160 to 70 characters/SMS** (potential 3× cost)
- Character miscounts causing unexpected campaign overages
- Partners questioning platform reliability
- Campaign ROI destroyed by billing surprises

**Technical Limitations:**
- System counted emoji as **1 character** (actually varies 2-8)
- Extended GSM characters triggering encoding switches
- Dynamic variables showing **static counts**
- No preview of actual device rendering

**Market Barriers:**
- RTL text (Arabic/Hebrew) rendering **broken and unreadable**
- Partners using external tools for accurate calculations
- Competitive disadvantage vs. specialized platforms

---

## BEFORE/AFTER

### Before: Misleading Character Count
[Screenshot of old interface showing incorrect count]

**What was wrong:**
- "118 characters" displayed, but actually **2 SMS segments** due to emoji
- No warning about encoding impact
- Arabic text displaying **left-aligned (unreadable)**
- Variables counted as placeholder text

### After: Intelligent Encoding Detection
[Screenshot of new interface with warnings and tooltips]

**What's improved:**
- **Real-time encoding detection** (GSM vs. UCS-2)
- **Color-coded warnings** for cost-impacting characters
- **Mobile preview** showing actual device rendering
- **RTL support** for Arabic/Hebrew with correct text flow
- **Smart variable estimation** (accounts for dynamic content)

---

## MY APPROACH

### Strategic Framing
Initially viewed as "minor technical issue" by management. **Second billing dispute created urgency** - I had a comprehensive solution ready.

### Constraint-Driven Design

**Limited resources, no user research time:**
- **Data source:** Support tickets + billing dispute details became "user research"
- **Validation:** Each dispute included screenshots, message content, cost calculations
- **Outcome:** Crowdsourced usability testing data from real enterprise pain

**Crisis timeline:**
- **Decision:** Comprehensive fix over band-aid solution
- **Rationale:** Prevent cascading issues from partial implementations
- **Result:** One-time investment eliminated recurring problems

---

## KEY DESIGN DECISIONS

### 1. Real-Time Detection vs. Post-Composition

**Decision:** Live encoding detection during typing  
**Rationale:** Cost awareness must happen during composition, not after mental commitment  
**Trade-off:** Performance overhead for immediate feedback  
**Result:** Partners actively modified content to optimize costs

### 2. Visual Warning System

**Decision:** Different icons for known vs. uncertain costs  
**Rationale:** Variables (uncertain) require different mental model than special characters (calculable)

**Visual language:**
- 🟡 Yellow warning = **Uncertain costs** (dynamic variables)
- 🔵 Blue info = **Known impacts** (emojis, special characters)

**Validation:** Zero confusion in post-launch support tickets

### 3. Character Highlighting Toggle

**Decision:** Optional highlighting of cost-impacting characters  
**Rationale:** Highlighting aids debugging but misrepresents final appearance  
**Risk:** Added interface complexity  
**Validation:** High toggle usage indicated clear user value

### 4. Mobile Device Preview

**Decision:** Full device mockup with real-time rendering  
**Rationale:** SMS consumed on mobile - preview builds send confidence  
**Impact:** Became highest-valued feature per partner feedback

---

## THE SOLUTION

### Intelligent Counting Engine

**How it works:**
1. **Real-time character analysis** as you type
2. **Encoding detection** (GSM-7, Extended GSM, UCS-2)
3. **Dynamic variable estimation** with defensive calculations
4. **Emoji sequence handling** (accounts for multi-byte characters)

**Technical approach:**
- Debounced checking (smooth typing performance)
- Cached encoding for unchanged sections
- Lazy evaluation for variable previews
- Optimized regex for character detection

### Visual Feedback Components

[Screenshot: Message composer with annotations]

**1. Real-time character count:**
- Current characters used
- Estimated SMS segments
- Contextual warnings

**2. Interactive tooltips:**
- Explains each character type's impact
- Shows sample values for variables
- Color-coded by severity

**3. Character highlighting toggle:**
- Shows emojis, special chars, variables
- Toggle on/off for debugging vs. preview

**4. Mobile preview:**
- Accurate device rendering
- Multi-segment pagination
- Variable field preview with sample data

### RTL Language Support

[Screenshot: Arabic text properly rendered]

**What we fixed:**
- Bidirectional text implementation
- Mixed-direction content handling
- Proper cursor behavior
- Arabic/Hebrew font integration

**Market impact:** Unlocked Middle East expansion

---

## QA & SAFEGUARDS

### Mandatory Acknowledgment System

[Screenshot: QA approval dialog]

**For messages with cost risk:**
- Partner must **explicitly confirm** understanding of variable text impact
- Transfers financial responsibility clearly
- Prevents accidental high-cost sends
- System warns but allows override (after acknowledgment)

**Result:** Clear liability separation, zero disputes post-launch

---

## VALIDATION & RESULTS

### Financial Impact
✅ **Zero billing disputes in 6+ months post-launch**  
✅ Reduced financial exposure from SMS campaigns  
✅ Eliminated recurring refund requests  

### Operational Efficiency
✅ Support tickets for SMS issues **dropped significantly**  
✅ QA approval process streamlined  
✅ Partner self-service improved dramatically  

### Market Expansion
✅ **Arabic/Hebrew markets now accessible**  
✅ Competitive parity with specialized platforms achieved  
✅ Foundation for additional messaging channels laid  

### Qualitative Validation
- Partner confidence restored (direct feedback)
- Positive reviews mentioning SMS functionality
- Platform perceived as **enterprise-ready**

---

## WHAT I LEARNED

### What Worked

**Crisis as business case:**  
Financial impact created urgency where user complaints hadn't. Quantifiable loss drives prioritization.

**Defensive design philosophy:**  
"Estimated" labeling and comprehensive warnings prevented new issues while solving core problem.

**Risk-first approach:**  
Building for worst-case scenarios prevented cascading issues.

### Challenges Solved

**International QA gaps:**  
Partner beta testing provided better validation than synthetic testing could achieve.

**Support knowledge gaps:**  
Self-documenting interface reduced dependency on support understanding encoding nuances.

**Competitive pressure:**  
Exceeded external tools through native integration rather than feature matching.

---

## STRATEGIC INSIGHTS

### Prevention Economics
**Reactive fixes cost multiples of proactive solutions.** Early investment prevents compound costs.

### Hidden Complexity
Simple surface features can hide significant technical depth affecting enterprise relationships.

### Constraints Drive Focus
Limited resources forced essential features only - preventing partial-fix problems.

---

## FUTURE OPPORTUNITIES

**Planned enhancements:**
- MMS support with media preview
- WhatsApp Business API integration
- Template library with pre-validated content
- AI-powered message optimization
- Cross-channel cost comparison

---

**This project proves constraint-driven design can transform crisis into opportunity** - eliminating enterprise financial risk while enabling global market expansion.

---

**[View live prototype]** | **[See technical documentation]** | **[Next case study →]**
