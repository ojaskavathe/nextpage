#!/bin/bash
cd /home/ubuntu/nextpage 
git pull origin master
export NODE_ENV=production
/home/ubuntu/.bun/bin/bun install &&
npx prisma generate &&
npm run build &&
pm2 restart nextpage 
