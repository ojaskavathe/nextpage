#!/bin/bash
cd /home/ubuntu/nextpage 
git pull origin master
export NODE_ENV=production
bun install &&
npx prisma generate &&
bun run build &&
pm2 restart nextpage 
