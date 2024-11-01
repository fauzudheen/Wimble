# Wimble

**Wimble** is a social media platform designed exclusively for IT professionals to connect, share insights, and collaborate in a professional environment. It features knowledge sharing through articles, community forums, team collaboration, and engagement options to help professionals grow together in the IT field.

## 🚀 Features

- **Article Sharing**: Share expertise and insights with the IT community through structured articles.
- **Communities**: Create and join communities around specific IT topics or technologies.
- **Team Collaboration**: Conduct meetings, chat, and share resources within professional teams.
- **Engagement**: Like, comment, and follow content and users.
- **Notifications**: Stay updated with personalized notification settings.
- **Knowledge Sharing**: Learn from peers and industry leaders through article sharing and community discussions.

## 🔧 Tech Stack

- **Frontend**: React, Redux, Tailwind CSS
- **Backend**: Python, Django, Django REST Framework
- **Architecture**: Microservices
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: PostgreSQL, AWS RDS
- **Real-time Communication**: WebSocket, Django Channels, Kafka
- **Payments**: Stripe
- **Containerization**: Docker, Kubernetes (AWS EKS)
- **Deployment**: AWS (EKS, RDS), GitHub Actions for CI/CD

## 🛠️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/fauzudheen/Wimble.git
   cd wimble
   ```

2. **Navigate to the backend Directory**
   ```bash
   cd server
   ```

3. **Run Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This command will build the images and start all services defined in your `docker-compose.yml` file.

4. **Access the Application**
   - Once the services are up, access the application at `http://localhost:<port>` (replace `<port>` with the port configured for your frontend service in `docker-compose.yml`).

## 🎯 Microservices Deployment (AWS)

Wimble uses AWS EKS for managing Kubernetes deployments. To deploy:

1. **Dockerize Services**: Ensure each microservice has a Dockerfile for containerization.
2. **Push Images to ECR**: Push Docker images to AWS ECR for integration with EKS.
3. **Deploy on EKS**:
   - Create Kubernetes deployment files and services.
   - Apply configurations using `kubectl`.

## 💳 Payments and Authentication

- **Stripe Integration**: Secure payment handling via Stripe for premium features.
- **JWT Authentication**: Secure user login and access control with JSON Web Tokens (JWT).

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes and push the branch:
   ```bash
   git commit -m "Add new feature"
   git push origin feature-name
   ```
4. Open a Pull Request.

## 📬 Contact

For any questions or suggestions, please contact the project maintainer:

- **Name**: Fauzudheen Abdul Hameed
- **Email**: fauzudheen2@gmail.com
