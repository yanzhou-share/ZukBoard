NOW_DEPLOY_ID=$( now --no-clipboard --regions=all --docker --token=$NOW_TOKEN -e OSS_ID=$OSS_ID -e OSS_SECRET=$OSS_SECRET -e MONGODB_URI=$MONGODB_URI_NOW_STAGING)
now alias $NOW_DEPLOY_ID "$NOW_CUSTOM_DOMAIN_STAGING" --token=$NOW_TOKEN
now rm $NOW_SUBDOMAIN --safe --yes --token=$NOW_TOKEN || exit 0