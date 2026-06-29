ArtHub – Online Art Marketplace ArtHub is a comprehensive, digital marketplace built on the MERN stack that bridges the gap between art enthusiasts, collectors, and emerging artists. The platform provides structured, role-based environments (User/Buyer, Artist, and Admin) allowing users to discover original creations, purchase pieces securely via Stripe, track sales, and manage platform assets efficiently.

🔗 Live Deployment & Repositories Live Production URL: https://art-hub-client-lilac.vercel.app

Client Repository: https://github.com/shakibul-islam-Dev/ArtHub_Client

Server Repository: https://github.com/shakibul-islam-Dev/ArtHub_server

🛠️ Technology Stack & Dependencies Client Side (Frontend) Framework: Next.js / React.js

Styling & Design: Tailwind CSS, Framer Motion (Fluid & modern animations), Lucide React (Icon sets)

Authentication: NextAuth.js / BetterAuth (Google OAuth & JWT-based Custom Credentials)

State & Data Fetching: TanStack Query (@tanstack/react-query) & Axios

Payment Integration: @stripe/stripe-js & @stripe/react-stripe-js

Theme Management: next-themes (For seamless, persistent Dark Mode toggle)

Server Side (Backend) Runtime Environment: Node.js with Express.js framework

Database: MongoDB utilizing Mongoose Object Data Modeling (ODM)

Security & Encryption: JSON Web Tokens (jsonwebtoken), bcryptjs, cors, and dotenv

Payment Gateway API: stripe (Node.js SDK)

🚀 Key Features

Robust Authentication & Role-Based Access Control (RBAC) Dual Authentication Methods: Supports traditional Email/Password signup alongside Google OAuth.
Onboarding Roles: Users select their explicit role—User (Buyer) or Artist—during registration.

Session Security: Secured via JWT (7-day expiration). Authentication states persist through application route reloads, ensuring active users on private dashboard paths are never incorrectly redirected back to the login page.

E-Commerce Pipeline & Subscription Tier Validation Stripe Checkout Sessions: Automated credit card transaction handling with secure server-side validation.
Tier Enforcement: Prior to any individual artwork purchase, the backend automatically validates the user's current subscription level:

Free (Default): Limited to a maximum of 3 artwork purchases ($0).

Pro: Limited to a maximum of 9 artwork purchases ($9.99/month).

Premium: Unlimited purchases allowed ($19.99/month).

Automated Post-Purchase Logic: Upon a successful purchase transaction, the item instantly receives a "Sold" badge, updates its state to automatically unpublish itself, and locks out further checkout requests.

Dedicated Role Dashboards User Dashboard (/dashboard/user): View payment history, monitor purchased artworks, manage profile configurations, and review subscription statuses.
Artist Dashboard (/dashboard/artist): Full CRUD capability on their own uploaded artworks. Upload artwork images through integrated ImgBB API hosting, track item sales metrics, and evaluate total income logs.

Admin Dashboard (/dashboard/admin): Complete management overview. Modify user roles, delete problematic artworks platform-wide, track global subscription/purchase transaction logs, and view responsive analytic data charts.

Search, Filtering, and Verified Interactions Dynamic Queries: Real-time search processing across artwork titles and artist names.
Multi-Parametric Filters: Filter parameters covering structural categories (Painting, Digital, Sculpture, etc.) combined with targeted pricing boundary controls (Min/Max).

Verified Comment System: An advanced comment submission route checks database logs to guarantee that only users who have actively purchased a specific artwork can leave a written review on its detail page.

🔑 Environment Variables Setup Configure the following environment variables to launch the application locally.

Frontend Configuration (.env.local) Code snippet NEXT*PUBLIC_API_URL=http://localhost:5000 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test*... NEXT*PUBLIC_IMGBB_API_KEY=your_imgbb_api_key NEXTAUTH_SECRET=your_nextauth_jwt_secret Backend Configuration (.env) Code snippet PORT=5000 MONGO_URI=mongodb+srv://:@cluster.mongodb.net/arthub JWT_SECRET=your_jwt_signing_token_secret STRIPE_SECRET_KEY=sk_test*... 🔐 Administrative Test Credentials To evaluate admin charts, complete database records, and evaluate general platform routing, use the following standardized administrative credentials:

Admin Email: admin@arthub.com

Admin Password: Admin@123
