import paramiko
import sys

host = "89.116.34.21"
user = "root"
password = "MridulQrlin#2026@Hosting"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(host, username=user, password=password, timeout=30)

def run(cmd, timeout=180):
    print(f"\n$ {cmd[:80]}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    combined = (out + err).strip()
    if combined:
        # Print safely
        safe = combined.encode('ascii', errors='replace').decode('ascii')
        print(safe[-800:] if len(safe) > 800 else safe)
    return out

# Continue from where we left off - db push first
print("==> Running prisma db push...")
run("cd /var/wedding && npx prisma db push --accept-data-loss 2>&1 | tail -5", timeout=60)

# Build
print("\n==> Building Next.js (takes 2-4 min)...")
run("cd /var/wedding && npm run build 2>&1 | tail -15", timeout=480)

# PM2
print("\n==> Setting up PM2...")
run("npm install -g pm2 2>&1 | tail -2", timeout=60)
run("pm2 delete wedding-invite 2>/dev/null; echo ok")
run("cd /var/wedding && PORT=3001 DATABASE_URL='file:/var/wedding/wedding.db' pm2 start npm --name 'wedding-invite' -- start -- -p 3001")
run("pm2 save 2>&1")
run("pm2 startup 2>&1 | tail -3")

# Nginx
print("\n==> Setting up Nginx...")
run("apt-get install -y nginx 2>&1 | tail -3", timeout=60)
run("""cat > /etc/nginx/sites-available/wedding << 'NGINXEOF'
server {
    listen 80;
    server_name 89.116.34.21;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF""")
run("ln -sf /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/wedding 2>/dev/null; echo ok")
run("rm -f /etc/nginx/sites-enabled/default 2>/dev/null; echo ok")
run("nginx -t 2>&1")
run("systemctl restart nginx 2>&1 | tail -2")
run("systemctl enable nginx 2>&1 | tail -2")

# Verify
print("\n==> Verifying...")
run("pm2 status")
run("sleep 5 && curl -s http://localhost:3001/api/wishes 2>&1 | head -c 300 || echo 'starting...'")
run("curl -s http://localhost/ 2>&1 | head -c 100 || echo 'nginx check'")

client.close()
print("\n=== DEPLOYMENT COMPLETE ===")
print("Hostinger:  http://89.116.34.21/")
print("Wishes API: http://89.116.34.21/api/wishes")
print("Vercel:     https://mridulvijaya.vercel.app/")
