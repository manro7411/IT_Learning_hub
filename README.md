Great! Below is a complete **English-language setup guide** for a full-stack project using:

* **Frontend:** React + TypeScript + Vite + Tailwind CSS
* **Backend:** Quarkus (Java framework)
* **Database:** PostgreSQL

You can copy this into a `README.md` or internal documentation for your team.

---

# 🌐 Full Stack Setup Guide (React + Tailwind + Quarkus + PostgreSQL)

---

## ⚙️ Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/) (v18+)
* [npm](https://www.npmjs.com/) (v9+)
* [Java JDK 17+](https://adoptium.net/)
* [Maven](https://maven.apache.org/)
* [Docker](https://www.docker.com/) (for PostgreSQL)

---

## 📁 Project Structure

```
my-fullstack-app/
│
├── backend/         # Quarkus + PostgreSQL
└── frontend/        # React + TypeScript + Vite + Tailwind CSS
```

---

# 🧩 Frontend Setup (React + Vite + Tailwind CSS)

## 1. Create the frontend project

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

## 2. Install Tailwind CSS (v3.x for CLI support)

```bash
npm install -D tailwindcss@3.4.1 postcss autoprefixer
npx tailwindcss init -p
```

## 3. Configure Tailwind

### Edit `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Edit `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Ensure Tailwind CSS is imported in `src/main.tsx`:

```ts
import './index.css';
```

## 4. Test Tailwind

Update `src/App.tsx`:

```tsx
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Tailwind OK!</h1>
    </div>
  );
}

export default App;
```

## 5. Run the dev server

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

# 🧪 Backend Setup (Quarkus + PostgreSQL)

## 1. Create Quarkus backend project

```bash
mkdir backend && cd backend
mvn io.quarkus.platform:quarkus-maven-plugin:3.8.2:create \
  -DprojectGroupId=com.example \
  -DprojectArtifactId=backend \
  -DclassName="com.example.GreetingResource" \
  -Dpath="/hello" \
  -Dextensions="resteasy-reactive, jdbc-postgresql, hibernate-orm, flyway"
cd backend
```

## 2. Configure application properties

Edit `src/main/resources/application.properties`:

```properties
quarkus.datasource.db-kind=postgresql
quarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5432/mydb
quarkus.datasource.username=postgres
quarkus.datasource.password=yourpassword
quarkus.hibernate-orm.database.generation=update
quarkus.flyway.migrate-at-start=true
```

## 3. Define Entity and Resource

Example Entity:

```java
@Entity
public class User {
    @Id @GeneratedValue
    public Long id;

    public String name;
}
```

Example REST Endpoint:

```java
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {
    @Inject
    EntityManager em;

    @GET
    public List<User> getUsers() {
        return em.createQuery("from User", User.class).getResultList();
    }

    @POST
    @Transactional
    public void addUser(User user) {
        em.persist(user);
    }
}
```

## 4. Set up PostgreSQL using Docker

```bash
docker run --name mydb -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
```

## 5. Run the backend

```bash
./mvnw quarkus:dev
```

Visit: [http://localhost:8080/hello](http://localhost:8080/hello)

---

# 🔗 Connect Frontend to Backend

Example API call in React:

```tsx
useEffect(() => {
  fetch("http://localhost:8080/users")
    .then((res) => res.json())
    .then(setUsers);
}, []);
```

---

# ✅ Done!

Your full-stack project is ready with:

* ✅ React (frontend)
* ✅ Tailwind CSS styling
* ✅ Quarkus REST API
* ✅ PostgreSQL as database

---
