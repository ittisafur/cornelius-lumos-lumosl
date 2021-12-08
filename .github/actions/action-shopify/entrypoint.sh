#!/bin/sh

# if [ -z "$SHOPIFY_USE_SLATE" ];
# then 
#   npm ci;
#   slate build;
# fi

if [ -z "$SHOPIFY_ENV_LABEL" ] || [ "$SHOPIFY_ENV_LABEL" == "" ]; 
then theme deploy --password=$SHOPIFY_PASSWORD --store=$SHOPIFY_STORE_URL --themeid=$SHOPIFY_ENV_THEMEID --dir=$THEME_PATH $INPUT_ARGS; 
else theme deploy --password=$SHOPIFY_PASSWORD --store=$SHOPIFY_STORE_URL --env=$SHOPIFY_ENV_LABEL --dir=$THEME_PATH $INPUT_ARGS; 
fi
