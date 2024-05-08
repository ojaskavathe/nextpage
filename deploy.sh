#!/bin/bash
cd /home/ubuntu/nextpage 
git pull origin master
export NODE_ENV=production
pnpm install &&
pnpm build &&
pm2 restart nextpage 
