# FormCraft - Custom Form Builder 📝

A powerful, modern form builder application similar to Typeform that allows you to create interactive forms with custom question types including categorization, cloze tests, and reading comprehension.

## 🚀 Features

### ✨ Form Builder
- **Drag & Drop Interface**: Intuitive form creation experience
- **Real-time Preview**: See your form as you build it
- **Custom Styling**: Add header images and question images
- **Form Settings**: Configure submission behavior and thank you messages

### 📋 Question Types
1. **Categorize**: Drag-and-drop items into predefined categories
2. **Cloze**: Fill-in-the-blank questions within sentences
3. **Comprehension**: Reading passages with follow-up questions (multiple choice, text, true/false)

### 🔧 Form Management
- Create, edit, and delete forms
- Publish/unpublish forms
- Share forms via unique URLs
- Copy shareable links

### 📊 Response Analytics
- Real-time response tracking
- Score calculation and analytics
- Export responses to CSV
- Response statistics and insights

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Mobile-friendly interface
- Toast notifications for user feedback
- Loading states and error handling

## 🛠 Tech Stack

### Frontend
- **React.js** (TypeScript)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Beautiful DnD** for drag-and-drop
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **Cloudinary** for image uploads (optional)
- **Express Validator** for input validation
- **CORS** and **Helmet** for security

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/formcraft.git
cd formcraft
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Configuration

#### Server Environment (server/.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/formbuilder
CLIENT_URL=http://localhost:3000

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=your_jwt_secret_key
```

#### Client Environment (client/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the necessary collections.

### 5. Run the Application

#### Development Mode
```bash
# From the root directory
npm run dev
```

This will start both the backend server (port 5000) and frontend client (port 3000).

#### Production Build
```bash
# Build the client
npm run build

# Start the server
npm run server
```

## 🚀 Deployment

### Vercel (Recommended for Frontend)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set the build command to: `cd client && npm run build`
4. Set the output directory to: `client/build`
5. Add environment variables in Vercel dashboard

### Render/Railway (Backend)
1. Connect your GitHub repository
2. Set the build command to: `cd server && npm install`
3. Set the start command to: `cd server && npm start`
4. Add environment variables including production MongoDB URI

### MongoDB Atlas (Database)
1. Create a MongoDB Atlas cluster
2. Get the connection string
3. Update `MONGODB_URI` in your production environment

## 📱 Usage

### Creating a Form
1. Click "Create New Form" from the dashboard
2. Set form title, description, and header image
3. Add questions using the question type buttons
4. Configure each question with specific settings
5. Save and publish your form

### Question Types Guide

#### Categorize Questions
- Create categories with custom colors
- Add items that users will drag into categories
- Set correct categories for automatic scoring

#### Cloze Questions
- Write sentences with `_____` for blanks
- Define correct answers and placeholder text
- Users fill in the blanks during submission

#### Comprehension Questions
- Add a reading passage
- Create multiple follow-up questions
- Support multiple choice, text input, and true/false questions

### Sharing Forms
1. Publish your form from the builder or dashboard
2. Copy the shareable link
3. Share with respondents
4. View responses and analytics in real-time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Typeform and Google Forms
- Built with modern React and Node.js practices
- Uses Tailwind CSS for beautiful, responsive design

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/formcraft/issues) page
2. Create a new issue if your problem isn't already listed
3. Provide detailed information about your setup and the issue

---

**Made with ❤️ for better form building experiences**

🔗 **Live Demo**: [FormCraft Demo](https://your-demo-link.vercel.app)
📧 **Contact**: your-email@example.com
🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/formcraft/issues)
