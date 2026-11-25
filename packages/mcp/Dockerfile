# The published ExhaustiveUI MCP server, over stdio:
#   docker build -t exhaustive-ui-mcp packages/mcp
#   docker run -i --rm exhaustive-ui-mcp
FROM node:24-alpine

ARG VERSION=latest
RUN npm install --global --ignore-scripts --no-audit --no-fund "@exhaustive-ui/mcp@${VERSION}" && npm cache clean --force

USER node
ENTRYPOINT ["exhaustive-ui-mcp"]
