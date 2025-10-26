#!/bin/bash

# Script de deploy para Google Cloud Run

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploy de Ventana de Johari a Cloud Run${NC}\n"

# Verificar que gcloud está instalado
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI no está instalado${NC}"
    echo "Instala gcloud CLI: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Solicitar Project ID
read -p "Ingresa tu Google Cloud Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: Project ID no puede estar vacío${NC}"
    exit 1
fi

# Solicitar región
echo "Regiones disponibles: europe-west1, us-central1, asia-northeast1"
read -p "Ingresa la región (default: europe-west1): " REGION
REGION=${REGION:-europe-west1}

# Configurar proyecto
echo -e "\n${BLUE}📝 Configurando proyecto...${NC}"
gcloud config set project $PROJECT_ID

# Construir imagen
echo -e "\n${BLUE}🔨 Construyendo imagen Docker...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/johari-window

# Deploy a Cloud Run
echo -e "\n${BLUE}🚀 Desplegando a Cloud Run...${NC}"
gcloud run deploy johari-window \
  --image gcr.io/$PROJECT_ID/johari-window \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

# Obtener URL
URL=$(gcloud run services describe johari-window --platform managed --region $REGION --format 'value(status.url)')

echo -e "\n${GREEN}✅ ¡Deploy exitoso!${NC}"
echo -e "${GREEN}🌐 Tu aplicación está disponible en:${NC}"
echo -e "${BLUE}$URL${NC}\n"
