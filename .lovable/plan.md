
# CNN-Based Retina Disease Detection System

## Overview
A comprehensive web application for automated retina disease detection supporting Diabetic Retinopathy, Glaucoma, Age-related Macular Degeneration, and Cataracts. Users can upload fundus images, get AI-powered predictions via an external API, and download reports and documentation.

## Pages & Layout

### 1. Landing / Home Page
- Hero section with app title, description, and CTA to upload an image
- Overview of supported diseases with icons
- How it works (3-step flow: Upload → Analyze → Download)
- Navigation bar with links to all sections

### 2. Image Upload & Analysis Page
- Drag-and-drop image upload zone for retina fundus images
- Image preview after upload
- "Analyze" button to send image to the external ML API
- Results display: disease classification, confidence scores (bar chart), severity level
- Option to download the analysis report as PDF or CSV

### 3. CNN Architecture & Education Page
- Visual diagram of the CNN architecture (convolutional layers, pooling, fully connected layers)
- Explanation of how the model works for retina disease detection
- Training methodology, dataset info, and performance metrics
- Downloadable files section:
  - CNN model architecture (Python/Jupyter notebook)
  - Dataset documentation
  - Research references

### 4. Disease Information Page
- Cards for each disease (Diabetic Retinopathy, Glaucoma, AMD, Cataracts)
- Description, symptoms, stages/severity levels, and sample fundus images
- How CNN detects each disease

### 5. Dashboard / History Page
- Table of past analyses (stored in localStorage)
- Quick view of previous predictions
- Bulk export as CSV

## Downloadable Files
- **PDF Reports**: Auto-generated analysis reports with patient image, predictions, confidence scores, and recommendations
- **CSV Export**: Prediction results in spreadsheet format
- **CNN Architecture Files**: Downloadable Python notebook with model code
- **Documentation**: Dataset info and methodology as downloadable PDF

## External API Integration
- Configurable API endpoint for the ML model
- Placeholder integration ready to connect to any REST API that accepts image input and returns predictions
- Error handling and loading states

## Design
- Clean, medical/professional UI with blue/teal color scheme
- Responsive design for desktop and mobile
- Charts using Recharts for confidence score visualization
