# Art Ecommerce Backend

Backend server for the Art Ecommerce platform, handling image uploads and storage using Cloudinary.

## Features

- Image upload endpoint for product images
- Cloudinary integration for cloud storage
- CORS enabled for frontend integration
- Express.js server

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Cloudinary account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Art-Ecommerce-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your Cloudinary credentials:
```env
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Important:** Make sure to set up your `.env` file before running the server, as these credentials are required for the application to function properly.

## Usage

### Development

**Note:** Ensure your `.env` file is properly configured before starting the server.


Start the server:
```bash
npm start
```

The server will run on `http://localhost:5000` by default (configurable via PORT environment variable)

### API Endpoints

#### Upload Image

- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `image`: Image file to upload
- **Response**:
  ```json
  {
    "imageUrl": "https://res.cloudinary.com/..."
  }
  ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | - |

## Dependencies

- `express` - Web framework
- `cors` - CORS middleware
- `multer` - File upload handling
- `cloudinary` - Cloud storage service
- `dotenv` - Environment variable management

## Project Structure

```
backend/
├── index.js          # Main server file
├── package.json      # Dependencies and scripts
├── .env             # Environment variables (not tracked)
├── .gitignore       # Git ignore rules
├── README.md        # This file
└── uploads/         # Temporary upload directory
```

## License

ISC
