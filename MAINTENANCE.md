# Maintenance & Operations Strategy

## 1. Release Cycle
We follow a structured release schedule to ensure stability:
- **Patch Releases (vX.X.1)**: Every Tuesday (Bug fixes, security updates).
- **Minor Releases (vX.1.0)**: Every 2nd Thursday (New features, UI improvements).
- **Major Releases (v1.0.0)**: Quarterly (Large architectural changes).

## 2. Rollback Strategy
In case of a failed deployment:
- **One-Click PM2 Rollback**: `pm2 rollback <id>` on the VPS.
- **GitHub Actions Revert**: Revert the last merge to `main` and trigger the auto-deploy.
- **DB Restore**: Use `scripts/backup.ts` snapshots to restore data if a migration fails.

## 3. Security Audit
Automated security checks are integrated:
- **npm audit**: Runs as part of the CI/CD pipeline.
- **Snyk/GitHub Dependabot**: Automated alerts for vulnerable dependencies.
- **Manual Audit**: Bi-annual review of all API endpoints and data access layers.

## 4. Monitoring & Alerting
- **Uptime**: Prometheus alerts if the API returns non-200 for > 5 minutes.
- **Errors**: Sentry alerts for any 'Fatal' or 'High' severity production errors.
- **Performance**: Weekly review of the AI Dashboard health metrics to ensure the system is scaling.
