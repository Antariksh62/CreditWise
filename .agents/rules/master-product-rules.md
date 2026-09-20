
# CreditWise Master Product Rules

> **CRITICAL PERSISTENT RULE**: Treat everything in this document as a persistent project rule for all CreditWise development.
> Whenever any later prompt or instruction conflicts with these rules, **PRESERVE THESE MASTER RULES**.
> Do not introduce fake data simply to make a page look complete. Reuse existing project architecture wherever possible.

---

## 1. CreditWise Core Principle
- **Not a Marketplace**: CreditWise is NOT a credit-card marketplace designed to push users toward cards.
- **Existing Spending Optimization**: CreditWise helps users understand how their **existing** spending could earn more value.
- **Core Product Mottos**:
  - *"What if your expenses could earn too?"*
  - *"Don't change how you spend. Change how you're rewarded."*
  - *"Your spending is personal. Your card should be too."*
  - *"Find the card that rewards your life."*
- **No Induced Spending**: The product optimizes existing spending. Do **NOT** encourage unnecessary spending.
- **Banned Vocabulary**: Never use language such as:
  - ❌ `maximize spending`
  - ❌ `spend more`
  - ❌ `unlock purchasing power`
  - ❌ `premium lifestyle`
  - ❌ `shop more`
  - ❌ `increase your spending`
- CreditWise should help users make more informed decisions about spending they already have.

---

## 2. Real Credit Cards Only (NON-NEGOTIABLE)
Every credit card shown anywhere in CreditWise must be a **REAL** card. Never invent:
- Card names
- Issuers / banks
- Reward rates
- Annual fees / joining fees / fee waivers
- Lounge benefits / fuel benefits / cashback rates
- Eligibility requirements
- Reward conversion values / welcome bonuses
- Card images / official URLs

> [!CAUTION]
> If information cannot be verified against official sources, **DO NOT invent it**.
> If a card image cannot confidently be matched to a real card, do not use it in recommendations until resolved.

---

## 3. CardWise Curation Standards
- Do **NOT** list every credit card available in India.
- Only include cards that meet our strict standards for:
  - Real-world usefulness
  - Reward value
  - Reasonable fees relative to value
  - Useful benefits & transparent conditions
  - Understandable reward structure
  - Relevance to actual spending patterns
- **Preferred messaging**:
  - *"Not every card meets our standards."*
  - *"We don't list every card. We list the cards worth considering."*
- **Banned messaging**:
  - ❌ *"didn't make our cut"* (sounds commercial and dismissive).

---

## 4. Recommendation Language: "Good Fit" vs "Good Card"
- CreditWise must distinguish a **"good card"** from a **"good fit for THIS user."**
- Never claim that one card is universally the best.
- Recommendations must be tailored to the user's:
  - Income & fee tolerance
  - Monthly expenses & category breakdown
  - Reward preferences (cashback vs air miles vs points)
  - Travel habits & international spend
  - Existing cards & existing banking relationships
- The result must explain:
  - **"Why this card fits you"**
  - rather than: ❌ *"This is the best credit card."*

---

## 5. Absolutely No Fake Data
Never create fake:
- Customers / user reviews / testimonials
- Statistics / usage numbers / approval rates
- Reward calculations / savings claims
- Card benefits / bank logos / issuer logos
- If a value is an estimate or calculation, **clearly identify it as an estimate**.

---

## 6. 20-Point Personal, Legal & Product Safety Checklist
1. **Privacy Policy**: Maintain a clear, accurate privacy policy.
2. **Terms of Service**: Maintain clear terms of service.
3. **Refund Policy**: State clearly that CreditWise does not charge users or sell anything (no paid purchase/refund mechanism); do NOT invent a refund process.
4. **Cookie Policy**: Detail cookies if and only if cookies are actually used.
5. **Cookie Consent**: Use consent mechanisms only where legally required by actual technologies; never add meaningless banner theatre.
6. **Form Auditing**: Validate every form input properly on both client and server.
7. **Data Minimization**: Do not collect unnecessary personal or financial data.
8. **Third-Party Audits**: Regularly audit third-party SDKs, scripts, analytics, and embeds.
9. **No Dark Patterns**: Zero deceptive patterns, pre-checked opt-ins, or forced loops.
10. **Fee Transparency**: Never hide fees, exclusions, caps, or renewal conditions.
11. **Authentic Social Proof**: Never fabricate testimonials, ratings, or quotes.
12. **Supported Claims**: Never make unsupported financial or reward claims.
13. **Accessibility (Alt Text)**: Provide meaningful, descriptive `alt` text on all images.
14. **Color Contrast**: Ensure all text meets WCAG AA contrast ratios against backgrounds.
15. **Keyboard Navigation**: Full keyboard navigation support across interactive components.
16. **Authentic Business Identity**: Transparent contact information; never invent fake corporate addresses, incorporation numbers, or legal identities.
17. **Adults Only**: Explicitly state CreditWise is intended for adults (18+); do not knowingly collect children's data.
18. **Unsubscribe Mechanism**: Ensure any future email communication includes a one-click unsubscribe mechanism.
19. **Asset Licensing**: Ensure all fonts, images, icons, and videos are properly licensed for production use.
20. **Data Deletion**: Provide a clear instructions/mechanism for users to delete their account and profile data.

---

## 7. Sensitive Financial Data Prohibition
**NEVER** ask users for:
- PAN or Aadhaar numbers
- Bank account or debit card numbers
- Credit card number or CVV
- UPI PINs, banking passwords, or OTPs
- Institution credentials, full transaction histories, or salary slips.

CreditWise only needs approximate category spending ranges for personalization.

---

## 8. User Experience & Questionnaire Philosophy
- Do not turn onboarding into an exhaustive financial interrogation.
- Ask only what is directly useful for personalization.
- **Prefer**:
  - Broad spending ranges
  - Selectable visual options
  - Simple everyday categories
  - Optional inputs
  - *"I don't know"* / *"Prefer not to say"* options
- Never force users to enter exact rupee figures.

---

## 9. Visual Product Rule
CreditWise must remain:
- **Minimal**
- **Editorial**
- **Premium**
- **Visual-first**
- **Calm & spacious**
- **Modern**
- Never turn CreditWise into a generic, cluttered SaaS dashboard.
