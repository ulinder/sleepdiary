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
      if (("$(git branch --show-current)"=="dev")); then
      rsync -av --exclude '.git' --exclude 'deploy.sh' "$SCRIPT_DIR/" "$PREPROD_DIR/"
      fi 
      ;;

    prod)
      echo "copy files to prod"
      git checkout master 
      if (("$(git branch --show-current)"=="master")); then
      rsync -av --exclude '.git' --exclude 'deploy.sh' "$SCRIPT_DIR/" "$PROD_DIR/"
      fi 
      ;;

    *)
      echo "unknown argument / argument missing. "
      ;;
  esac

fi