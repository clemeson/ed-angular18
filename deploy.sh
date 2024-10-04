#!/bin/bash

# Nome do bucket no S3
BUCKET_NAME="ed-teste-angular18"
REGION="us-east-1" # Modifique para a sua região preferida

# Caminho para o diretório da build do Angular
DIST_DIR="./dist/browser/"

# Verifica se o build foi gerado
if [ ! -d "$DIST_DIR" ]; then
  echo "A pasta $DIST_DIR não foi encontrada. Certifique-se de ter executado 'ng build --prod'."
  exit 1
fi

# Cria o bucket S3 (se não existir)
echo "Criando bucket S3 (se não existir)..."
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null

# Configura o bucket S3 como um site estático
echo "Configurando o bucket para site estático..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Remove todos os arquivos do bucket
echo "Removendo todos os arquivos existentes no bucket S3..."
aws s3 rm s3://$BUCKET_NAME --recursive

# Fazendo upload dos arquivos da build para o bucket S3
echo "Fazendo upload da build Angular para o bucket S3..."
aws s3 sync $DIST_DIR s3://$BUCKET_NAME/

# Exibe a URL do bucket S3
echo "Deploy completo. Acesse sua aplicação em:"
echo "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
