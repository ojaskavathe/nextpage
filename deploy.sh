#!/bin/bash
cd /home/ubuntu/nextpage 
git pull origin master
pnpm install &&
pnpm build &&
pm2 restart nextpage 
