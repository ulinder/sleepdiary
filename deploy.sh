#!/bin/bash
###############################################################################
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
      # if (("$(git branch --show-current)"=="dev")); then
      rsync -av --exclude '.git' --exclude 'deploy.sh' "$SCRIPT_DIR/" "$PREPROD_DIR/"
      echo "BRANCH=dev\nPORT=3001\nNODE_ENV=production" > "$PREPROD_DIR/.env"
      npm install
      pm2 reload sleepdiary-pre-prod
      #fi 
      ;;

    prod)
      echo "copy files to prod"
      git checkout master 
      # if (("$(git branch --show-current)"=="master")); then
      rsync -av --exclude '.git' --exclude 'deploy.sh' "$SCRIPT_DIR/" "$PROD_DIR/"
      echo "BRANCH=master\nPORT=3001\nNODE_ENV=production" > "$PROD_DIR/.env"
      npm install
      pm2 reload sleepdiary-pre-prod
      # fi 
      ;;

    *)
      echo "Version missing: pre-prod / prod "
      ;;
  esac

fi