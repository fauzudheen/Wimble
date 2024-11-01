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
   git clone https://github.com/your-username/wimble.git
   cd wimble
   ```

2. **Backend Setup**
   - Install Python packages:
     ```bash
     pip install -r backend/requirements.txt
     ```
   - Set up environment variables for Django and database configurations in a `.env` file in the backend folder.

3. **Frontend Setup**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure environment variables in `.env` for frontend settings (e.g., API URLs).

4. **Run Application Locally**
   - Start the Django server:
     ```bash
     python manage.py runserver
     ```
   - Start the React frontend:
     ```bash
     npm start
     ```

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
