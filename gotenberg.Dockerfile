# Use Gotenberg for LibreOffice conversion
FROM gotenberg/gotenberg:8

# Configure Gotenberg for PowerPoint conversion
CMD ["gotenberg", \
     "--chromium-disable-web-security", \
     "--chromium-incognito", \
     "--chromium-disable-crash-reporter", \
     "--libreoffice-disable-routes=false", \
     "--api-port=3000"]

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
