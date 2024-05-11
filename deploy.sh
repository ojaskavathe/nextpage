#!/bin/bash
cd /home/ubuntu/nextpage 
git pull origin master
export NODE_ENV=production
/home/ubuntu/.bun/bin/bun install &&
/home/ubuntu/.bun/bin/bunx prisma generate &&
/home/ubuntu/.bun/bin/bun run build &&
/usr/bin/pm2 restart nextpage 
