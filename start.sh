#!/bin/bash
export LOCAL_IP_HEARIFY=$(hostname -I | awk '{print $1}')
docker-compose up -d --build