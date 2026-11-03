## Live Link : https://togetherly-client-murex.vercel.app/
# Togetherly - Social Development Events Platform

**Small Acts. Greater Impact.**

Togetherly is a community-driven social development and event management platform where people can create, discover, and join community service events. It helps individuals participate in meaningful activities and contribute to positive social change.

## 🌐 Live Website

[https://togetherly-client-murex.vercel.app/](https://togetherly-client-murex.vercel.app/)

## ✨ Key Features

- **Authentication:** Secure registration and login using email/password and Google authentication with Better Auth.
- **Create Events:** Authenticated users can create social development events with descriptions, categories, images, locations, and dates.
- **Upcoming Events:** Browse upcoming community service events with event details and organized layouts.
- **Event Details:** View complete event information and participant details without requiring login.
- **Join Events:** Authenticated users can join events and participate in community activities.
- **Duplicate Join Prevention:** Prevents users from joining the same event multiple times.
- **Manage Events:** Users can update and delete their own created events.
- **Joined Events:** View and manage events joined by the logged-in user.
- **Protected Routes:** Restricts private pages to authenticated users.
- **Responsive Design:** Optimized layouts for mobile, tablet, and desktop devices.
- **Dark and Light Theme:** Switch between light and dark modes.
- **Toast Notifications:** Provides feedback for successful actions and errors.

## 🛠️ Technology Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Lucide React

**Authentication**
- Better Auth
- MongoDB Adapter
- JWT
- Google OAuth

**Backend Communication**
- REST API
- Fetch API

**Deployment**
- Vercel

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/raihankabir1952/togetherly-client.git
cd togetherly-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_better_auth_secret

MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace the placeholder values with your own credentials.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
togetherly-client/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── package.json
└── README.md
```

## 🔗 Related Repository

**Backend Repository:**  
[https://github.com/raihankabir1952/togetherly-server](https://github.com/raihankabir1952/togetherly-server)

## 👨‍💻 Author

**Md Raihan Kabir**

- GitHub: [raihankabir1952](https://github.com/raihankabir1952)

---

*Togetherly — Small Acts. Greater Impact.*
