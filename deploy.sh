#!/bin/bash
###############################################################################
# example 
# . deploy.sh pre-prod
SCRIPT_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTER_DIR="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
PREPROD_DIR="$OUTER_DIR/pre-prod"
PROD_DIR="$OUTER_DIR/prod"
OK=1
[ ! -d $PREPROD_DIR ] && echo "Directory $PREPROD_DIR DOES NOT exist." && OK=0
[ ! -d $PROD_DIR ] && echo "Directory $PROD_DIR DOES NOT exist." && OK=0

if (($OK)); then
  case $1 in

    pre-prod)
      echo "copy files to pre-prod"
      git checkout dev 
      git pull
      # if (("$(git branch --show-current)"=="dev")); then
      rsync -av --exclude '.git' --exclude 'deploy.sh' "$SCRIPT_DIR/" "$PREPROD_DIR/"
      echo -e "
      BRANCH=dev
      PORT=3002
      NODE_ENV=production" > "$PREPROD_DIR/.env"
      npm install --only=prod
      pm2 reload sleepdiary-pre-prod
      #fi 
      ;;

    prod)
      echo "copy files to prod"
      git checkout master 
      git pull
      # if (("$(git branch --show-current)"=="master")); then
      rsync -av --exclude '.git' --exclude 'deploy.sh' "$SCRIPT_DIR/" "$PROD_DIR/"
      echo -e "
      BRANCH=master
      PORT=3001
      NODE_ENV=production" > "$PROD_DIR/.env"
      npm install --only=prod
      pm2 reload sleepdiary-prod
      # fi 
      ;;

    *)
      echo "Version missing: pre-prod / prod "
      ;;
  esac

fi