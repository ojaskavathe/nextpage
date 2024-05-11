#!/bin/bash
cd /home/ubuntu/nextpage 
git pull origin master
export NODE_ENV=production
/home/ubuntu/.bun/bin/bun install &&
/home/ubuntu/.bun/bin/bunx prisma generate &&
/home/ubuntu/.bun/bin/bun run build &&
/home/ubuntu/.nvm/versions/node/v21.7.3/bin/pm2 restart nextpage 
