#!/bin/bash

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting Deployment Sequence...${NC}"

# 1. Build the loop app (Vite)
echo -e "\n${GREEN}🔨 Building Loop App...${NC}"
npm run build:loop
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Aborting.${NC}"
    exit 1
fi

# 2. Build the Next.js app (Important: this compiles home.tsx changes!)
echo -e "\n${GREEN}🔨 Building Next.js App...${NC}"
cd frontend && npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Next.js build failed! Aborting.${NC}"
    exit 1
fi
cd ..

# 3. Kill existing server process on port 3000
echo -e "\n${GREEN}💀 Killing process on port 3000...${NC}"
PID=$(lsof -t -i:3000)
if [ -n "$PID" ]; then
    kill -9 $PID
    echo "Process $PID killed."
else
    echo "No process found on port 3000."
fi

# 4. Start the server
echo -e "\n${GREEN}🌱 Starting Next.js Server...${NC}"
cd frontend && npm start
